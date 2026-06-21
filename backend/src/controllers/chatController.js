const Product = require('../models/Product');
const { getEmbedding } = require('../config/embedding');

const buildProductContext = (products) => {
  return products
    .map((product, index) => {
      const price = typeof product.price === 'number' ? `${product.price}` : `${product.price}`;
      return `Produit ${index + 1} :\nNom : ${product.name}\nPrix : ${price}€${product.description ? `\nDescription : ${product.description}` : ''}`;
    })
    .join('\n\n');
};

const buildFallbackResponse = (products, message) => {
  if (!products || products.length === 0) {
    return "Désolé, je n'ai trouvé aucun produit pertinent pour votre recherche.";
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

const callOpenAI = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (typeof fetch !== 'function') {
    throw new Error('fetch n\u2019est pas disponible dans cet environnement Node.js');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Tu es un conseiller e-commerce.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 250,
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'OpenAI API request failed');
  }

  return data.choices?.[0]?.message?.content?.trim() || null;
};

const generateAnswer = async (prompt) => {
  try {
    const openAIAnswer = await callOpenAI(prompt);
    if (openAIAnswer) {
      return openAIAnswer;
    }
  } catch (error) {
    console.warn('[chatController] OpenAI fallback:', error.message);
  }

  return null;
};

const handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Le message est requis.' });
    }

    const trimmedMessage = message.trim();
    const queryEmbedding = await getEmbedding(trimmedMessage);

    const products = await Product.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 3,
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

    if (!products || products.length === 0) {
      return res.status(200).json({
        answer: "Désolé, je n'ai trouvé aucun produit pertinent pour votre recherche.",
        products: [],
      });
    }

    const context = buildProductContext(products);
    const prompt = `Tu es un conseiller e-commerce.\n\nProduits disponibles :\n${context}\n\nQuestion : ${trimmedMessage}\n\nRéponds en recommandant uniquement les produits pertinents.`;

    const llmAnswer = await generateAnswer(prompt);
    const answer = llmAnswer || buildFallbackResponse(products, trimmedMessage);

    const sanitizedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      score: product.score,
    }));

    return res.status(200).json({
      answer,
      products: sanitizedProducts,
    });
  } catch (error) {
    console.error('[chatController] error:', error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  handleChatMessage,
};
