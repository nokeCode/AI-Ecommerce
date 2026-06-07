const connectDB = require('../config/db');
const Product = require('../models/Product');
const { getEmbedding } = require('../config/embedding');

async function generateEmbeddings() {

  await connectDB();

  const products = await Product.find();

  for (const product of products) {

    const text = `
      Nom: ${product.name}
      Description: ${product.description}
      Tags: ${Array.isArray(product.tags) ? product.tags.join(' ') : ''}
    `;

    const embedding = await getEmbedding(text);

    product.embedding = embedding;
    await product.save();

    console.log(`Embedding généré : ${product.name}`);
  }

  console.log(`Embeddings générés pour ${products.length} produits.`);
  process.exit();
}

generateEmbeddings();

