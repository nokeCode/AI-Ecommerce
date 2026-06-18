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

    const queryVector = await getEmbedding(query);

    const dim = Array.isArray(queryVector) ? queryVector.length : null;
    const min = Array.isArray(queryVector) ? Math.min(...queryVector) : null;
    const max = Array.isArray(queryVector) ? Math.max(...queryVector) : null;

    // Vérifie rapidement que la collection contient bien des embeddings non vides
    const embeddingSampleCount = await Product.countDocuments({
      embedding: { $exists: true, $type: 'array', $ne: [] }
    });

    console.log('[semanticSearch] query=', JSON.stringify(query));
    console.log('[semanticSearch] queryVector dim=', dim, 'min=', min, 'max=', max);
    console.log('[semanticSearch] embeddingSampleCount=', embeddingSampleCount);

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
      // projection minimale pour éviter les surprises de structure
      {
        $project: {
          name: 1,
          description: 1,
          longDescription: 1,
          price: 1,
          originalPrice: 1,
          category: 1,
          image: 1,
          images: 1,
          tags: 1,
          embedding: 0,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ]);

    // log quelques scores/ids
    console.log('[semanticSearch] results count=', results?.length);
    if (Array.isArray(results) && results.length > 0) {
      console.log('[semanticSearch] sample result=', {
        id: results[0]._id,
        name: results[0].name,
        score: results[0].score
      });
    }

    return res.json(results);

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
