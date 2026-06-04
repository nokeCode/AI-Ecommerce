const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  customerName: String,

  customerEmail: String,

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      quantity: Number,

      price: Number
    }
  ],

  totalAmount: Number,

  status: {
    type: String,
    default: "pending"
  }
},
{
  timestamps: true
});