const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

// GET tous les produits
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .lean();

    // Normaliser pour l'UI: category doit être une string
    const normalized = products.map((p) => ({
      ...p,
      id: p._id,
      category: p.category?.name ?? "",
    }));

    res.status(200).json(normalized);
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
      product = await Product.findById(id).populate("category", "name");
    } catch (_) {
      // ignore: ex id="1" non-ObjectId
    }

    if (!product) {
      product = await Product.findOne({ productId: id }).populate("category", "name");
    }

    if (!product) {
      return res.status(404).json({
        message: "Produit introuvable",
      });
    }

    const normalized = {
      ...product.toObject(),
      id: product._id,
      category: product.category?.name ?? "",
    };

    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;