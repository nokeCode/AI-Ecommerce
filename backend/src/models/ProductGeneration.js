const mongoose = require('mongoose');

const productGenerationSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  originalImage: {
    type: String
  },
  originalAttributes: {
    type: String
  },
  generatedDescription: {
    type: String
  },
  generatedSeoTitle: {
    type: String
  },
  generatedSeoDescription: {
    type: String
  },
  status: {
    type: String,
    enum: ['PENDING', 'DONE', 'FAILED'],
    default: 'PENDING'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

productGenerationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ProductGeneration = mongoose.model('ProductGeneration', productGenerationSchema);
module.exports = ProductGeneration;