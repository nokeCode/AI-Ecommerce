require('dotenv').config();
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const Category = require('../models/Category');

async function seedCategories() {
  await connectDB();

  console.log(
    'Seed Category - DB utilisée :',
    mongoose.connection.db.databaseName
  );

  await Category.deleteMany({});

  const categories = [
    {
      name: 'Canapés & Fauteuils',
      description:
        'Canapés, fauteuils, poufs et assises pour le salon.',
      parentCategory: null
    },
    {
      name: 'Tables & Bureaux',
      description:
        'Tables basses, tables à manger, bureaux et consoles.',
      parentCategory: null
    },
    {
      name: 'Chambres',
      description:
        'Lits, tables de chevet, armoires et mobilier de chambre.',
      parentCategory: null
    },
    {
      name: 'Décoration',
      description:
        'Objets décoratifs, cadres, miroirs et accessoires de maison.',
      parentCategory: null
    },
    {
      name: 'Éclairage',
      description:
        'Lampes de table, lampadaires, suspensions et luminaires.',
      parentCategory: null
    }
  ];

  const inserted = await Category.insertMany(categories);

  console.log(
    `Seed Category - catégories créées : ${inserted.length}`
  );

  return inserted;
}

module.exports = { seedCategories };