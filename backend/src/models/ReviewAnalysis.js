const mongoose = require('mongoose');

const reviewAnalysisSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  summary: {
    type: String
  },
  pros: [String],
  cons: [String],
  keywords: [String],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

reviewAnalysisSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ReviewAnalysis = mongoose.model('ReviewAnalysis', reviewAnalysisSchema);
module.exports = ReviewAnalysis;