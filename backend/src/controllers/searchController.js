const Product = require('../models/Product');
const { getEmbedding } = require('../config/embedding');

const semanticSearch = async (req, res) => {

  try {

    const { query } = req.body;

    const queryVector =
      await getEmbedding(query);

    const results =
      await Product.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector,
            numCandidates: 100,
            limit: 10
          }
        }
      ]);

    res.json(results);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

module.exports = { semanticSearch };