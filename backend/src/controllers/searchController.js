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

    // 1) Recherche classique (mots exacts / substring via regex)
    const regex = new RegExp(trimmedQuery, 'i');

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
    const filtered = Array.isArray(results)
      ? results.filter(r => typeof r.score === 'number' && r.score > threshold)
      : [];

    console.log('[semanticSearch] results count=', results?.length);
    console.log('[semanticSearch] filtered count (threshold=' + threshold + ')=', filtered.length);

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
