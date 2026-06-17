require('dotenv').config();

const { seedProducts } = require('./seedProducts');
const { generateEmbeddings } = require('../scripts/generateEmbeddings');

async function seedAll() {
  await seedProducts();
  await generateEmbeddings();
}

// CLI entrypoint
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('Seed global terminé avec succès.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed global échoué :', err);
      process.exit(1);
    });
}

module.exports = { seedAll };

