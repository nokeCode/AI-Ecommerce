const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: String
  },

  imageUrl: {
    type: String
  },

  stock: {
    type: Number,
    default: 0
  },

  embedding: {
    type: [Number],
    default: []
  }
},
{
  timestamps: true
});