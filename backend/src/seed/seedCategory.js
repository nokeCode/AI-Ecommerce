require('dotenv').config();
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const Category = require('../models/Category');

async function seedCategories() {
  await connectDB();
  console.log('Seed Category - DB utilisée :', mongoose.connection.db.databaseName);

  await Category.deleteMany({});

  const categories = [
    {
      name: 'Costumes & Mariage',
      description: 'Costumes, tenues de cérémonie et accessoires pour événements formels.',
      parentCategory: null
    },
    {
      name: 'Chemises & Tops',
      description: 'Chemises, hauts et pièces essentielles pour un look soigné.',
      parentCategory: null
    },
    {
      name: 'Chaussures',
      description: 'Chaussures pour le quotidien et le sport.',
      parentCategory: null
    },
    {
      name: 'Vêtements & Accessoires',
      description: 'Vêtements et accessoires complémentaires.',
      parentCategory: null
    },
    {
      name: 'Sport',
      description: 'Articles et tenues dédiés à la pratique sportive.',
      parentCategory: null
    }
  ];

  const inserted = await Category.insertMany(categories);
  console.log(`Seed Category - catégories créées : ${inserted.length}`);
  return inserted;
}

module.exports = { seedCategories };

