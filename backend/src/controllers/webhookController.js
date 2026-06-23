const Stripe = require("stripe");
const Order = require("../models/Order");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Erreur signature webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Traiter les événements
  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutSessionCompleted(event.data.object);
    }

    if (event.type === "charge.refunded") {
      await handleChargeRefunded(event.data.object);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Erreur traitement webhook:", error);
    res.status(500).json({ error: error.message });
  }
};

async function handleCheckoutSessionCompleted(session) {
  console.log("✅ Paiement confirmé - Session:", session.id);

  try {
    // Récupérer les détails de la session
    const expandedSession = await stripe.checkout.sessions.retrieve(
      session.id,
      { expand: ["line_items"] }
    );

    // Créer la commande dans MongoDB
    const order = await Order.create({
      orderId: session.id,
      userId: session.metadata?.userId || null,
      items: expandedSession.line_items.data.map(item => ({
        productId: item.metadata?.productId || null,
        quantity: item.quantity,
        price: item.price_data?.unit_amount
          ? item.price_data.unit_amount / 100
          : item.amount_total / (item.quantity * 100)
      })),
      totalPrice: session.amount_total / 100,
      status: "PAID",
      paymentStatus: "PAID",
      paymentMethod: "CARD",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent
    });

    console.log("✅ Commande créée:", order._id);
  } catch (error) {
    console.error("❌ Erreur création commande:", error);
    throw error;
  }
}

async function handleChargeRefunded(charge) {
  console.log("💔 Remboursement - Charge:", charge.id);

  try {
    // Trouver et mettre à jour la commande
    const order = await Order.findOne({
      stripePaymentIntentId: charge.payment_intent
    });

    if (order) {
      order.paymentStatus = "REFUNDED";
      order.status = "CANCELLED";
      await order.save();
      console.log("✅ Commande mise à jour:", order._id);
    }
  } catch (error) {
    console.error("❌ Erreur traitement remboursement:", error);
    throw error;
  }
}
