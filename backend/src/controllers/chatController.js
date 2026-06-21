const Product = require('../models/Product');
const { getEmbedding } = require('../config/embedding');

// En dessous de ce score de similarité, on considère que la question
// n'a aucun rapport avec le catalogue (texte aléatoire, hors-sujet, etc.)
// Le score $vectorSearch pour un index "cosine" est compris entre 0 et 1.
// À calibrer en regardant les scores réels dans vos logs (voir console.log plus bas).
const RELEVANCE_THRESHOLD = 0.6;

const buildProductContext = (products) => {
  return products
    .map((product, index) => {
      const price = typeof product.price === 'number' ? `${product.price}` : `${product.price}`;
      return `Produit ${index + 1} :\nNom : ${product.name}\nPrix : ${price}€${product.description ? `\nDescription : ${product.description}` : ''}`;
    })
    .join('\n\n');
};

// Réponse de secours utilisée UNIQUEMENT si l'appel à Gemini échoue
// (clé absente, quota dépassé, panne réseau...). Elle ne doit jamais
// servir de comportement "normal" de l'application.
const buildFallbackResponse = (products, message) => {
  if (!products || products.length === 0) {
    return "Désolé, je n'ai pas trouvé de produit en lien avec votre demande. Pouvez-vous préciser votre recherche ?";
  }

  const lines = ['Je vous recommande :'];
  products.forEach((product, index) => {
    const price = typeof product.price === 'number' ? `${product.price}` : `${product.price}`;
    lines.push(`${index + 1}. ${product.name} - ${price}€`);
  });

  const firstProduct = products[0];
  const cleanMessage = message.trim().replace(/\s+/g, ' ').toLowerCase();
  const firstLine = firstProduct.description
    ? `${firstProduct.name} est particulièrement adapté${cleanMessage.includes('mariage') ? ' à une cérémonie ou un mariage' : ''}.`
    : `${firstProduct.name} est particulièrement adapté à votre recherche.`;

  lines.push('', firstLine);
  return lines.join('\n');
};

// Message renvoyé quand ni le LLM ni les produits ne permettent de répondre
// (ex: texte incompréhensible, hors-sujet).
const buildNoMatchResponse = () => {
  return "Désolé, je n'ai pas compris votre demande. Pouvez-vous reformuler ou préciser ce que vous recherchez (type de meuble, budget, pièce à aménager...) ?";
};

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (typeof fetch !== 'function') {
    throw new Error('fetch n\u2019est pas disponible dans cet environnement Node.js');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.3,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Gemini API request failed');
  }

  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('').trim();
  return text || null;
};

const generateAnswer = async (prompt) => {
  try {
    const geminiAnswer = await callGemini(prompt);
    if (geminiAnswer) {
      return geminiAnswer;
    }
  } catch (error) {
    console.warn('[chatController] Gemini fallback:', error.message);
  }

  return null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractUserMessage = (body) => {
  if (!body) return null;

  // If body is a raw string (text/plain), return it
  if (typeof body === 'string' && body.trim()) {
    return body.trim();
  }

  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message.trim();
  }

  if (Array.isArray(body.messages)) {
    for (let i = body.messages.length - 1; i >= 0; i -= 1) {
      const item = body.messages[i];
      if (item?.role === 'user') {
        if (typeof item.content === 'string' && item.content.trim()) {
          return item.content.trim();
        }

        if (Array.isArray(item.parts)) {
          return item.parts.map((part) => part?.text ?? '').join('').trim();
        }
      }
    }
  }

  return null;
};

const streamTextResponse = async (res, text) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
  res.status(200);

  const chunkSize = 32;
  for (let pos = 0; pos < text.length; pos += chunkSize) {
    const chunk = text.slice(pos, pos + chunkSize);
    res.write(chunk);
    await sleep(20);
  }

  res.end();
};

const handleChatMessage = async (req, res) => {
  try {
    const userPrompt = extractUserMessage(req.body);

    if (!userPrompt) {
      return res.status(400).type('text/plain').send('Le message est requis.');
    }

    const queryEmbedding = await getEmbedding(userPrompt);

    const rawResults = await Product.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 5,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          category: 1,
          image: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);

    // Utile pour calibrer RELEVANCE_THRESHOLD : décommentez si besoin.
    // console.log('[chatController] scores:', rawResults.map((p) => `${p.name}: ${p.score.toFixed(3)}`));

    // On ne garde que les produits réellement pertinents par rapport à la
    // question. $vectorSearch renvoie toujours les "moins mauvais"
    // résultats même pour un texte sans rapport avec le catalogue, donc
    // il faut filtrer par score, pas seulement prendre le top N.
    const products = rawResults.filter((product) => product.score >= RELEVANCE_THRESHOLD);

    if (!products || products.length === 0) {
      return streamTextResponse(res, buildNoMatchResponse());
    }

    const context = buildProductContext(products);
    const prompt = `Tu es un conseiller e-commerce pour un magasin de meubles. Réponds toujours en français, de façon naturelle et concise.

Voici les produits de notre catalogue qui semblent en lien avec la question de l'utilisateur :
${context}

Question de l'utilisateur : "${userPrompt}"

Consignes :
- Si l'utilisateur pose une question générale (ex: quels produits avez-vous, que proposez-vous), présente simplement les produits ci-dessus sans forcer une "recommandation".
- Si l'utilisateur cherche un produit précis ou demande un conseil, recommande le(s) produit(s) le(s) plus pertinent(s) parmi la liste, en expliquant brièvement pourquoi.
- N'invente aucun produit, prix ou caractéristique qui ne figure pas dans la liste ci-dessus.
- Si aucun produit de la liste ne correspond vraiment à la question, dis-le clairement plutôt que de recommander un produit non pertinent.
- Reste bref (3 à 5 phrases maximum).`;

    const llmAnswer = await generateAnswer(prompt);
    const answer = llmAnswer || buildFallbackResponse(products, userPrompt);

    return streamTextResponse(res, answer);
  } catch (error) {
    console.error('[chatController] error:', error);
    return res.status(500).type('text/plain').send(error.message || 'Une erreur serveur est survenue.');
  }
};

module.exports = {
  handleChatMessage,
};