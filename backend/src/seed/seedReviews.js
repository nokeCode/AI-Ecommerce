require('dotenv').config();
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');

async function seedReviews({ userIds, countPerProduct = 3 } = {}) {
  await connectDB();
  console.log('Seed Reviews - DB utilisée :', mongoose.connection.db.databaseName);

  if (!userIds || userIds.length === 0) {
    throw new Error('seedReviews: userIds manquants');
  }

  await Review.deleteMany({});

  const products = await Product.find({});
  if (!products.length) {
    throw new Error('seedReviews: aucun produit trouvé');
  }

  const comments = [
    'Très bonne qualité, conforme à la description.',
    'Service rapide et produit agréable à porter.',
    'Bon rapport qualité/prix. Je recommande !',
    'Belle finition, taille bien ajustée.',
    'Un peu déçu par la matière mais globalement correct.',
    'Parfait pour l’occasion, rendu au top.',
    'Confort excellent, emballage soigné.',
    'Correspond exactement à mes attentes.',
    'Bon produit, je rachèterai sans hésiter.',
    'Qualité au rendez-vous, super achat.'
  ];

  // Création de reviews réparties : ~ countPerProduct par produit
  const reviews = [];
  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < countPerProduct; j++) {
      const userId = userIds[(i + j) % userIds.length];
      const rating = 3 + ((i + j) % 3); // 3..5
      const comment = comments[(i * countPerProduct + j) % comments.length];

      reviews.push({
        productId: products[i]._id,
        userId,
        rating,
        comment
      });
    }
  }

  const inserted = await Review.insertMany(reviews);
  console.log(`Seed Reviews - reviews créées : ${inserted.length}`);
  return inserted;
}

module.exports = { seedReviews };

