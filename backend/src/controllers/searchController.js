const Product = require('../models/Product');
const { getEmbedding } = require('../config/embedding');


const semanticSearch = async (req, res) => {

  try {

    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid query',
        query
      });
    }

    const trimmedQuery = query.trim();
    //echappe les caractères spéciaux regex pour éviter un crash sur des requests
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // 1) Recherche classique (mots exacts / substring via regex)
    const regex = new RegExp(escapeRegex(trimmedQuery, 'i'));

    const classicalResults = await Product.find({
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { longDescription: { $regex: regex } },
        { tags: { $elemMatch: { $regex: regex } } }
      ]
    }).limit(10);

    // 2) Si au moins un résultat classique: on ne lance pas la vectorielle
    if (classicalResults.length > 0) {
      return res.json(classicalResults);
    }

    // 2bis) Garde-fou avant la recherche vectorielle : rejette les chaînes qui
    // ressemblent à du texte tapé au hasard (ex: "aerttfjfe fikjfja"), sans
    // dépendre uniquement du réglage fin du seuil de similarité.
    // Heuristique: en français/anglais un mot réel a un ratio voyelles/lettres
    // raisonnable. Un "mash" clavier a souvent un ratio très faible.
    const isLikelyGibberish = (text) => {
      const words = text.split(/\s+/).filter(Boolean);
      if (words.length === 0) return true;

      const suspiciousWords = words.filter((w) => {
        const letters = (w.match(/[a-zàâäéèêëïîôöùûüç]/gi) || []).length;
        const vowels = (w.match(/[aeiouyàâäéèêëïîôöùûü]/gi) || []).length;
        // Mot trop long sans aucune espace probable + ratio voyelles trop bas
        return letters >= 6 && letters > 0 && vowels / letters < 0.2;
      });

      // Si la majorité des mots "longs" du texte ressemblent à du charabia, on bloque.
      return suspiciousWords.length > 0 && suspiciousWords.length >= Math.ceil(words.length / 2);
    };

    if (isLikelyGibberish(trimmedQuery)) {
      console.log('[semanticSearch] requête jugée non pertinente (gibberish guard):', trimmedQuery);
      return res.json([]);
    }

    // 3) Recherche vectorielle (sens) + seuil de similarité
    const queryVector = await getEmbedding(trimmedQuery);

    const dim = Array.isArray(queryVector) ? queryVector.length : null;
    const min = Array.isArray(queryVector) ? Math.min(...queryVector) : null;
    const max = Array.isArray(queryVector) ? Math.max(...queryVector) : null;

    const sumRounded = Array.isArray(queryVector)
      ? queryVector.reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0)
      : null;

    // hash léger (pas cryptographique) : somme arrondie + 1ère/dernière valeur
    const lightHash = Array.isArray(queryVector)
      ? {
          sumRounded: Number(sumRounded?.toFixed?.(6)),
          first: Number(queryVector[0]?.toFixed?.(6)),
          last: Number(queryVector[queryVector.length - 1]?.toFixed?.(6)),
        }
      : null;

    // Vérifie rapidement que la collection contient bien des embeddings non vides
    const embeddingSampleCount = await Product.countDocuments({
      embedding: { $exists: true, $type: 'array', $ne: [] }
    });

    console.log('[semanticSearch] query=', JSON.stringify(trimmedQuery));
    console.log(
      '[semanticSearch] queryVector dim=',
      dim,
      'min=',
      min,
      'max=',
      max,
      'lightHash=',
      lightHash
    );
    console.log('[semanticSearch] embeddingSampleCount=', embeddingSampleCount);

    const sampleDbProducts = await Product.find({
      embedding: { $exists: true, $type: 'array', $ne: [] },
    })
      .select({ name: 1, embedding: 1 })
      .limit(2);

    if (sampleDbProducts?.length) {
      console.log('[semanticSearch] sampleDbProducts=',
        sampleDbProducts.map((p) => ({
          id: p._id,
          name: p.name,
          dim: Array.isArray(p.embedding) ? p.embedding.length : null,
          first: Array.isArray(p.embedding) ? p.embedding[0]?.toFixed?.(6) : null,
          last: Array.isArray(p.embedding) ? p.embedding[p.embedding.length - 1]?.toFixed?.(6) : null,
          sumRounded: Array.isArray(p.embedding)
            ? Number(
                p.embedding
                  .reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0)
                  .toFixed(6)
              )
            : null,
        }))
      );
    }

    const results = await Product.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector,
          numCandidates: 100,
          limit: 10
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          longDescription: 1,
          price: 1,
          originalPrice: 1,
          category: 1,
          image: 1,
          images: 1,
          tags: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ]);

    // Filtrage par seuil de similarité
    const threshold = 0.6; // 0.6 car pour 0.7 aucun produit n'as de score jusqu'a 0.7
    const aboveThreshold = Array.isArray(results)
      ? results.filter(r => typeof r.score === 'number' && r.score > threshold)
      : [];

    // Seuil relatif : en plus du seuil absolu, on ne garde que les résultats
    // proches du meilleur score trouvé. Comme ce modèle compresse les scores
    // (les bonnes requêtes ne dépassent jamais beaucoup 0.6-0.65), un seuil
    // absolu seul laisse parfois passer du bruit. On exige donc que le résultat
    // soit à moins de `relativeGap` du meilleur score de la requête.
    const relativeGap = 0.05;
    const topScore = aboveThreshold.length > 0
      ? Math.max(...aboveThreshold.map(r => r.score))
      : 0;

    const filtered = aboveThreshold.filter(r => r.score >= topScore - relativeGap);

    console.log('[semanticSearch] results count=', results?.length);
    console.log('[semanticSearch] aboveThreshold count (threshold=' + threshold + ')=', aboveThreshold.length);
    console.log('[semanticSearch] topScore=', topScore, '-> filtered count (relativeGap=' + relativeGap + ')=', filtered.length);

    if (filtered.length === 0) {
      return res.json([]);
    }

    return res.json(filtered);

  } catch (error) {

    console.error('[semanticSearch] error:', error);

    return res.status(500).json({
      error: error.message,
      details: {
        // pour aider à diagnostiquer les erreurs Mongo/Atlas Vector Search
        name: error.name,
        code: error.code,
        queryEmbeddingDimension: Array.isArray(req?.body?.query) ? null : undefined
      }
    });

  }
};

module.exports = { semanticSearch };
