const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  longDescription: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number

  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },

  image: {
    type: String
  },
  images: [
    {
      type: String
    }
  ],
  inStock: {
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
  specs: {
    type: Object,
    default: {}
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

productSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;