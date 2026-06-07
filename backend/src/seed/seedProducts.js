require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');
const mongoose = require('mongoose');
async function seed() {

  await connectDB();
  console.log(
  'Database utilisée :',
  mongoose.connection.db.databaseName
);

  await Product.deleteMany();

  await Product.insertMany([
    {
      name: "Costume Bleu",
      description: "Costume élégant pour mariage",
      price: 120,
      stock: 10,
      tags: ["mariage", "costume", "homme"]
    },
    {
      name: "Chemise Blanche",
      description: "Chemise formelle en coton",
      price: 40,
      stock: 20,
      tags: ["chemise", "bureau"]
    },
    {
      name: "Basket Running",
      description: "Chaussure confortable pour le sport",
      price: 70,
      stock: 15,
      tags: ["running", "sport"]
    }
  ]);

  console.log("Produits créés");

  process.exit();
}

seed();