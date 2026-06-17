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

async function seed() {
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

  const catCostumes = categoryByName.get('Costumes & Mariage')?._id;
  const catChemises = categoryByName.get('Chemises & Tops')?._id;
  const catChaussures = categoryByName.get('Chaussures')?._id;
  const catVetAcc = categoryByName.get('Vêtements & Accessoires')?._id;
  const catSport = categoryByName.get('Sport')?._id;

  const demoProducts = [
    // 1-4 Costumes
    {
      name: 'Costume Bleu',
      description: 'Costume élégant pour mariage',
      longDescription:
        'Costume bleu classique, confortable et idéal pour un événement formel. Coupe soignée et tissu de qualité.',
      price: 120,
      originalPrice: 160,
      inStock: 10,
      status: 'active',
      category: catCostumes,
      image:
        'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520975682071-a0b2b7e3f0c9?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Atelier', color: 'Bleu', size: 'M/L' },
      specs: { material: 'Laine mélangée', season: 'Toute saison' },
      tags: ['mariage', 'costume', 'homme', 'bleu']
    },
    {
      name: 'Costume Gris Anthracite',
      description: 'Costume moderne, prêt pour l’élégance',
      longDescription:
        'Costume gris anthracite au tombé impeccable. Conçu pour une tenue élégante et confortable, du bureau aux grandes occasions.',
      price: 140,
      originalPrice: 175,
      inStock: 8,
      status: 'active',
      category: catCostumes,
      image:
        'https://images.unsplash.com/photo-1520975869019-8e4b1cc3a5f1?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975869019-8e4b1cc3a5f1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Atelier', color: 'Gris', size: 'S/M/L/XL' },
      specs: { material: 'Laine', season: 'Mi-saison' },
      tags: ['costume', 'gris', 'formel']
    },
    {
      name: 'Costume Beige Classique',
      description: 'Costume léger et élégant',
      longDescription:
        'Un costume beige à la coupe moderne, parfait pour les événements en extérieur. Matière respirante et finitions soignées.',
      price: 135,
      originalPrice: 170,
      inStock: 7,
      status: 'active',
      category: catCostumes,
      image:
        'https://images.unsplash.com/photo-1520975693590-0a8c5b4c5e9b?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975693590-0a8c5b4c5e9b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520975682071-a0b2b7e3f0c9?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Atelier', color: 'Beige', size: 'M/L/XL' },
      specs: { material: 'Mélange', season: 'Été' },
      tags: ['costume', 'beige', 'été']
    },
    {
      name: 'Costume Noir Élégant',
      description: 'Costume noir pour occasions spéciales',
      longDescription:
        'Costume noir intemporel. Coupe ajustée, tissu agréable au toucher et tenue impeccable. Idéal pour les soirées et cérémonies.',
      price: 150,
      originalPrice: 190,
      inStock: 6,
      status: 'active',
      category: catCostumes,
      image:
        'https://images.unsplash.com/photo-1520975916079-7c0dd1a3d1d0?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975916079-7c0dd1a3d1d0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520975869019-8e4b1cc3a5f1?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Atelier', color: 'Noir', size: 'S/M/L' },
      specs: { material: 'Laine', season: 'Toute saison' },
      tags: ['costume', 'noir', 'soirée']
    },

    // 5-8 Chemises
    {
      name: 'Chemise Blanche',
      description: 'Chemise formelle en coton',
      longDescription:
        'Chemise blanche en coton respirant. Parfaite pour le bureau et les événements professionnels, avec une tenue impeccable.',
      price: 40,
      originalPrice: 55,
      inStock: 20,
      status: 'active',
      category: catChemises,
      image:
        'https://images.unsplash.com/photo-1520975682030-5d7f52dbb2c7?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975682030-5d7f52dbb2c7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520975916079-7c0dd1a3d1d0?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Classic', color: 'Blanc', size: 'S/M/L' },
      specs: { fabric: 'Coton', fit: 'Regular' },
      tags: ['chemise', 'bureau', 'blanc', 'coton']
    },
    {
      name: 'Chemise Bleu Ciel',
      description: 'Chemise douce et respirante',
      longDescription:
        'Chemise bleu ciel à la coupe confortable. Idéale pour un look frais en journée et facile à porter au quotidien.',
      price: 42,
      originalPrice: 58,
      inStock: 18,
      status: 'active',
      category: catChemises,
      image:
        'https://images.unsplash.com/photo-1520975682071-a0b2b7e3f0c9?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975682071-a0b2b7e3f0c9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Classic', color: 'Bleu', size: 'S/M/L/XL' },
      specs: { fabric: 'Coton', fit: 'Regular' },
      tags: ['chemise', 'bleu', 'coton']
    },
    {
      name: 'Chemise Rayée Marine',
      description: 'Chemise à rayures élégantes',
      longDescription:
        'Rayures marines modernes pour un style sûr et raffiné. Confort et maintien pour une tenue impeccablement chic.',
      price: 48,
      originalPrice: 62,
      inStock: 12,
      status: 'active',
      category: catChemises,
      image:
        'https://images.unsplash.com/photo-1520975869019-8e4b1cc3a5f1?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975869019-8e4b1cc3a5f1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520975682030-5d7f52dbb2c7?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Atelier', color: 'Marine', size: 'M/L/XL' },
      specs: { fabric: 'Coton', fit: 'Slim' },
      tags: ['chemise', 'rayé', 'marine']
    },
    {
      name: 'Polo Noir Chic',
      description: 'Polo premium pour un style casual',
      longDescription:
        'Polo noir élégant, idéal pour un look casual chic. Texture agréable, col bien structuré.',
      price: 35,
      originalPrice: 45,
      inStock: 22,
      status: 'active',
      category: catChemises,
      image:
        'https://images.unsplash.com/photo-1520975916079-7c0dd1a3d1d0?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975916079-7c0dd1a3d1d0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520975869019-8e4b1cc3a5f1?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Classic', color: 'Noir', size: 'S/M/L' },
      specs: { fabric: 'Coton piqué', fit: 'Regular' },
      tags: ['polo', 'noir', 'casual']
    },

    // 9-12 Chaussures
    {
      name: 'Basket Running',
      description: 'Chaussure confortable pour le sport',
      longDescription:
        'Basket de running conçue pour le confort au quotidien. Semelle amortissante et maintien pour accompagner tes entraînements.',
      price: 70,
      originalPrice: 90,
      inStock: 15,
      status: 'active',
      category: catSport,
      image:
        'https://images.unsplash.com/photo-1528701800489-20f5c2c9e4e3?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1528701800489-20f5c2c9e4e3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'RunPro', color: 'Noir/Gris', size: '40/41/42/43' },
      specs: { type: 'Running', cushioning: 'Amorti' },
      tags: ['running', 'sport', 'basket']
    },
    {
      name: 'Chaussures Casual Marron',
      description: 'Baskets casual polyvalentes',
      longDescription:
        'Chaussures marron au style intemporel. Confort tout au long de la journée, pour aller au bureau ou sortir en ville.',
      price: 65,
      originalPrice: 85,
      inStock: 14,
      status: 'active',
      category: catChaussures,
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1528701800489-20f5c2c9e4e3?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Urban', color: 'Marron', size: '40/41/42/43/44' },
      specs: { type: 'Casual', cushioning: 'Confort' },
      tags: ['casual', 'marron', 'chaussures']
    },
    {
      name: 'Chaussures De Ville Noires',
      description: 'Élégance pour le quotidien',
      longDescription:
        'Chaussures de ville noires pour un look professionnel. Assise confortable et style affirmé.',
      price: 90,
      originalPrice: 120,
      inStock: 9,
      status: 'active',
      category: catChaussures,
      image:
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Elegance', color: 'Noir', size: '40/41/42/43' },
      specs: { type: 'Ville', sole: 'Flexible' },
      tags: ['ville', 'noir', 'élégant']
    },
    {
      name: 'Sandales d’Été',
      description: 'Confort à la belle saison',
      longDescription:
        'Sandales pensées pour la chaleur. Semelle légère et maintien pour marcher toute la journée.',
      price: 30,
      originalPrice: 40,
      inStock: 25,
      status: 'active',
      category: catChaussures,
      image:
        'https://images.unsplash.com/photo-1528701800489-20f5c2c9e4e3?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1528701800489-20f5c2c9e4e3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Summer', color: 'Beige', size: '40/41/42/43' },
      specs: { type: 'Été', comfort: 'Léger' },
      tags: ['été', 'sandales', 'confort']
    },

    // 13-16 Vêtements & Accessoires
    {
      name: 'Ceinture Cuir',
      description: 'Ceinture élégante en cuir',
      longDescription:
        'Ceinture en cuir souple, design classique. Parfaite pour habiller un look formel ou casual.',
      price: 25,
      originalPrice: 35,
      inStock: 30,
      status: 'active',
      category: catVetAcc,
      image:
        'https://images.unsplash.com/photo-1520975682030-5d7f52dbb2c7?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975682030-5d7f52dbb2c7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'LeatherCo', color: 'Brun', size: 'S/M/L' },
      specs: { material: 'Cuir', buckle: 'Classique' },
      tags: ['ceinture', 'cuir', 'accessoire']
    },
    {
      name: 'Casquette Sport',
      description: 'Casquette légère pour l’extérieur',
      longDescription:
        'Casquette idéale pour le sport et les sorties. Légère, ajustable, protège efficacement du soleil.',
      price: 18,
      originalPrice: 25,
      inStock: 40,
      status: 'active',
      category: catVetAcc,
      image:
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Sporty', color: 'Noir', size: 'Réglable' },
      specs: { material: 'Tissu respirant', visor: 'Courte' },
      tags: ['casquette', 'sport', 'extérieur']
    },
    {
      name: 'Veste Légère',
      description: 'Veste fine pour les journées fraîches',
      longDescription:
        'Veste légère à porter en mi-saison. Confortable, facile à superposer, parfaite pour sortir sans se refroidir.',
      price: 55,
      originalPrice: 70,
      inStock: 11,
      status: 'active',
      category: catVetAcc,
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520975869019-8e4b1cc3a5f1?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Urban', color: 'Gris', size: 'S/M/L/XL' },
      specs: { material: 'Mélange', season: 'Mi-saison' },
      tags: ['veste', 'mi-saison', 'urbain']
    },
    {
      name: 'Sac à Dos Noir',
      description: 'Sac à dos pratique et robuste',
      longDescription:
        'Sac à dos noir spacieux, idéal pour le quotidien. Portage confortable et compartiments pour organiser tes affaires.',
      price: 45,
      originalPrice: 60,
      inStock: 13,
      status: 'active',
      category: catVetAcc,
      image:
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'BackPack', color: 'Noir', size: '24L' },
      specs: { material: 'Tissu résistant', compartments: 'Multiple' },
      tags: ['sac', 'dos', 'accessoire']
    },

    // 17-20 Sport
    {
      name: 'Legging Technique',
      description: 'Legging respirant pour entraînement',
      longDescription:
        'Legging technique offrant maintien et confort. Tissu respirant pour les séances de sport intensives.',
      price: 38,
      originalPrice: 50,
      inStock: 19,
      status: 'active',
      category: catSport,
      image:
        'https://images.unsplash.com/photo-1528701800489-20f5c2c9e4e3?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1528701800489-20f5c2c9e4e3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Active', color: 'Noir', size: 'S/M/L' },
      specs: { material: 'Élastique', tech: 'Respirant' },
      tags: ['sport', 'legging', 'training']
    },
    {
      name: 'T-Shirt Training Blanc',
      description: 'T-shirt léger pour la performance',
      longDescription:
        'T-shirt training blanc à séchage rapide. Conçu pour maximiser le confort et la liberté de mouvement.',
      price: 22,
      originalPrice: 30,
      inStock: 28,
      status: 'active',
      category: catSport,
      image:
        'https://images.unsplash.com/photo-1520975682030-5d7f52dbb2c7?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975682030-5d7f52dbb2c7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Active', color: 'Blanc', size: 'S/M/L/XL' },
      specs: { fabric: 'Tech', dryFast: true },
      tags: ['t-shirt', 'training', 'blanc']
    },
    {
      name: 'Short de Sport Bleu',
      description: 'Short confortable pour courir',
      longDescription:
        'Short de sport bleu. Tissu léger, poches pratiques, et coupe qui accompagne chaque mouvement.',
      price: 24,
      originalPrice: 32,
      inStock: 17,
      status: 'active',
      category: catSport,
      image:
        'https://images.unsplash.com/photo-1520975869019-8e4b1cc3a5f1?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975869019-8e4b1cc3a5f1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1528701800489-20f5c2c9e4e3?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Active', color: 'Bleu', size: 'S/M/L/XL' },
      specs: { fabric: 'Léger', pockets: true },
      tags: ['short', 'sport', 'courir']
    },
    {
      name: 'Hoodie Gris',
      description: 'Hoodie chaud et confortable',
      longDescription:
        'Hoodie gris pour rester au chaud. Matière douce, capuche confortable et finitions solides.',
      price: 52,
      originalPrice: 65,
      inStock: 9,
      status: 'active',
      category: catVetAcc,
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520975869019-8e4b1cc3a5f1?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: { brand: 'Comfy', color: 'Gris', size: 'S/M/L/XL' },
      specs: { material: 'Coton', warmth: 'Moyenne' },
      tags: ['hoodie', 'gris', 'confort']
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

  process.exit(0);
}

seed();

