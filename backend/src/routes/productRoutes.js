const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

// GET tous les produits
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET un produit par ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Supporte à la fois :
    // - un vrai _id Mongo (ObjectId)
    // - un id seed (string/number) stocké éventuellement dans productId
    // Mongoose: findById attend un ObjectId, donc on évite le CastError.
    let product = null;
    try {
      product = await Product.findById(id);
    } catch (_) {
      // ignore: ex id="1" non-ObjectId
    }

    if (!product) {
      product = await Product.findOne({ productId: id });
    }


    if (!product) {
      return res.status(404).json({
        message: "Produit introuvable",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;