const express = require("express");
const { createCheckoutSession } = require("../controllers/paymentController");
const { handleWebhook } = require("../controllers/webhookController");

const router = express.Router();

// Webhook doit être avant express.json()
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

router.post("/create-checkout", createCheckoutSession);

module.exports = router;
