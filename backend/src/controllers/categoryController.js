const Category = require('../models/Category');

// GET all categories
const getCategories = async (_req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCategories,
};

