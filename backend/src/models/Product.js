const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  shortDescription: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  basePrice: {
    type: Number
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  images: [{
    url: String
  }],
  stock: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  attributes: {
    brand: String,
    color: String,
    size: String
  },
  tags: [String],
  embedding: {
    type: [Number], // pour la recherche vectorielle
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;