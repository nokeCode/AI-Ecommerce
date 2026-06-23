const Stripe = require("stripe");

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { items, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        error: "Le panier est vide"
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: items.map(item => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      })),

      mode: "payment",

      metadata: {
        userId: userId || "anonymous"
      },

      success_url:
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/cancel`
    });

    res.json({
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error("Erreur Stripe:", error);
    res.status(500).json({
      error: error.message
    });
  }
};