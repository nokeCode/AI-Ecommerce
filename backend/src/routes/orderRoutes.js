const express = require("express");
const router = express.Router();

const Order = require("../models/Orders");

// Créer une commande
router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);

    res.status(201).json({
      message: "Commande créée avec succès",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Récupérer une commande
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Commande introuvable",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;