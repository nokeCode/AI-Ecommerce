require('dotenv').config();
const connectDB = require('../config/db');
const mongoose = require('mongoose');

const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const User = require('../models/User');

const { seedCategories } = require('./seedCategory');
const { seedUsers } = require('./seedUser');
const { seedReviews } = require('./seedReviews');

async function seedProducts() {
  await connectDB();

  console.log('Database utilisée :', mongoose.connection.db.databaseName);

  // Reset complet (ordre important)
  await Review.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});
  await Category.deleteMany({});

  const categories = await seedCategories();
  const users = await seedUsers();

  const categoryByName = new Map(categories.map((c) => [c.name, c]));

  const catCanapes = categoryByName.get('Canapés & Fauteuils')?._id;
  const catTables = categoryByName.get('Tables & Bureaux')?._id;
  const catChambres = categoryByName.get('Chambres')?._id;
  const catDecoration = categoryByName.get('Décoration')?._id;
  const catEclairage = categoryByName.get('Éclairage')?._id;


  const demoProducts = [
    // 1-4 Costumes
    {
      name: 'Canapé Scandinave Gris',
      description: 'Canapé moderne au design nordique',
      longDescription:
        'Canapé scandinave confortable avec revêtement en tissu gris et pieds en bois naturel. Idéal pour les salons contemporains.',
      price: 499,
      originalPrice: 599,
      inStock: 12,
      status: 'active',
      category: catCanapes,
      image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg',
      images: [
        'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg',
        'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg'
      ],
      attributes: {
        brand: 'Nordic Home',
        color: 'Gris',
        seats: '3 places'
      },
      specs: {
        material: 'Tissu premium',
        frame: 'Bois massif'
      },
      tags: ['canape', 'scandinave', 'salon']
    },

    {
      name: 'Canapé d’Angle Moderne',
      description: 'Canapé spacieux pour toute la famille',
      longDescription:
        'Canapé d’angle moderne offrant un confort exceptionnel et un design élégant.',
      price: 799,
      originalPrice: 950,
      inStock: 8,
      status: 'active',
      category: catCanapes,
      image: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg',
      images: [
        'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg',
        'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg'
      ],
      attributes: {
        brand: 'Urban Living',
        color: 'Beige',
        seats: '5 places'
      },
      specs: {
        material: 'Tissu',
        shape: 'Angle'
      },
      tags: ['canape', 'angle', 'moderne']
    },

    {
      name: 'Fauteuil Velours Beige',
      description: 'Fauteuil élégant et confortable',
      longDescription:
        'Fauteuil en velours doux avec assise généreuse. Apporte une touche raffinée à votre intérieur.',
      price: 249,
      originalPrice: 320,
      inStock: 15,
      status: 'active',
      category: catCanapes,
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      images: [
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
      ],
      attributes: {
        brand: 'Comfort Plus',
        color: 'Beige'
      },
      specs: {
        material: 'Velours'
      },
      tags: ['fauteuil', 'velours']
    },

    {
      name: 'Pouf Design Rond',
      description: 'Pouf décoratif polyvalent',
      longDescription:
        'Pouf moderne pouvant servir d’assise supplémentaire ou de repose-pieds.',
      price: 89,
      originalPrice: 120,
      inStock: 20,
      status: 'active',
      category: catCanapes,
      image: 'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg',
      images: [
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg'
      ],
      attributes: {
        brand: 'Design Home',
        color: 'Crème'
      },
      specs: {
        material: 'Tissu'
      },
      tags: ['pouf', 'deco']
    },
    {
      name: 'Table Basse Bois Massif',
      description: 'Table basse élégante en bois naturel',
      longDescription:
        'Table basse robuste réalisée en bois massif avec finition naturelle.',
      price: 199,
      originalPrice: 250,
      inStock: 10,
      status: 'active',
      category: catTables,
      image: 'https://images.pexels.com/photos/3932930/pexels-photo-3932930.jpeg',
      images: [
        'https://images.pexels.com/photos/3932930/pexels-photo-3932930.jpeg'
      ],
      attributes: {
        brand: 'WoodArt',
        color: 'Naturel'
      },
      specs: {
        material: 'Chêne massif'
      },
      tags: ['table', 'salon']
    },

    {
      name: 'Table à Manger Chêne',
      description: 'Grande table familiale',
      longDescription:
        'Table à manger en chêne conçue pour accueillir jusqu’à 8 personnes.',
      price: 599,
      originalPrice: 720,
      inStock: 6,
      status: 'active',
      category: catTables,
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg',
      images: [
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg'
      ],
      attributes: {
        brand: 'WoodArt'
      },
      specs: {
        material: 'Chêne'
      },
      tags: ['table', 'manger']
    },

    {
      name: 'Bureau Minimaliste',
      description: 'Bureau moderne pour télétravail',
      longDescription:
        'Bureau compact et élégant offrant un espace de travail confortable.',
      price: 279,
      originalPrice: 340,
      inStock: 11,
      status: 'active',
      category: catTables,
      image: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg',
      images: [
        'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg'
      ],
      attributes: {
        brand: 'OfficePro'
      },
      specs: {
        material: 'Bois et métal'
      },
      tags: ['bureau']
    },

    {
      name: 'Console Moderne',
      description: 'Console décorative pour entrée',
      longDescription:
        'Console élégante parfaite pour mettre en valeur vos objets décoratifs.',
      price: 189,
      originalPrice: 230,
      inStock: 9,
      status: 'active',
      category: catTables,
      image: 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg',
      images: [
        'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg'
      ],
      attributes: {
        brand: 'Urban Decor'
      },
      specs: {
        material: 'Bois MDF'
      },
      tags: ['console']
    },
    {
      name: 'Lit Queen Size Moderne',
      price: 699,
      originalPrice: 850,
      inStock: 7,
      status: 'active',
      category: catChambres,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      tags: ['lit', 'chambre']
    },

    {
      name: 'Table de Chevet Blanche',
      price: 79,
      originalPrice: 99,
      inStock: 25,
      status: 'active',
      category: catChambres,
      image: 'https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg',
      tags: ['chevet']
    },

    {
      name: 'Armoire Contemporaine',
      price: 549,
      originalPrice: 650,
      inStock: 5,
      status: 'active',
      category: catChambres,
      image: 'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg',
      tags: ['armoire']
    },

    {
      name: 'Commode Bois Naturel',
      price: 229,
      originalPrice: 290,
      inStock: 10,
      status: 'active',
      category: catChambres,
      image: 'https://images.pexels.com/photos/5824519/pexels-photo-5824519.jpeg',
      tags: ['commode']
    },

    {
      name: 'Miroir Rond Doré',
      price: 99,
      originalPrice: 129,
      inStock: 20,
      status: 'active',
      category: catDecoration,
      image: 'https://images.pexels.com/photos/6492403/pexels-photo-6492403.jpeg',
      tags: ['miroir']
    },

    {
      name: 'Vase Céramique Design',
      price: 45,
      originalPrice: 60,
      inStock: 30,
      status: 'active',
      category: catDecoration,
      image: 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg',
      tags: ['vase']
    },

    {
      name: 'Tableau Abstrait Moderne',
      price: 120,
      originalPrice: 160,
      inStock: 14,
      status: 'active',
      category: catDecoration,
      image: 'https://images.pexels.com/photos/1573434/pexels-photo-1573434.jpeg',
      tags: ['tableau']
    },

    {
      name: 'Horloge Murale Élégante',
      price: 59,
      originalPrice: 80,
      inStock: 18,
      status: 'active',
      category: catDecoration,
      image: 'https://images.pexels.com/photos/707582/pexels-photo-707582.jpeg',
      tags: ['horloge']
    },

    {
      name: 'Lampe de Chevet LED',
      price: 69,
      originalPrice: 89,
      inStock: 22,
      status: 'active',
      category: catEclairage,
      image: 'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg',
      tags: ['lampe']
    },

    {
      name: 'Suspension Industrielle',
      price: 149,
      originalPrice: 190,
      inStock: 12,
      status: 'active',
      category: catEclairage,
      image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg',
      tags: ['suspension']
    },

    {
      name: 'Lampadaire Moderne',
      price: 179,
      originalPrice: 220,
      inStock: 9,
      status: 'active',
      category: catEclairage,
      image: 'https://images.pexels.com/photos/6585756/pexels-photo-6585756.jpeg',
      tags: ['lampadaire']
    },

    {
      name: 'Applique Murale Design',
      price: 85,
      originalPrice: 110,
      inStock: 16,
      status: 'active',
      category: catEclairage,
      image: 'https://images.pexels.com/photos/6444263/pexels-photo-6444263.jpeg',
      tags: ['applique']
    }
  ];

  const insertedProducts = await Product.insertMany(demoProducts);
  console.log(`Produits créés : ${insertedProducts.length}`);

  // Reviews: 3 par produit = 60 reviews
  await seedReviews({ userIds: users.map((u) => u._id), countPerProduct: 3 });

  const productsCount = await Product.countDocuments({});
  const categoriesCount = await Category.countDocuments({});
  const usersCount = await User.countDocuments({});
  const reviewsCount = await Review.countDocuments({});
  console.log('Counts =>', { categoriesCount, usersCount, productsCount, reviewsCount });

  return insertedProducts;
}

// CLI entrypoint
if (require.main === module) {
  seedProducts()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed products échoué :', err);
      process.exit(1);
    });
}

module.exports = { seedProducts };


