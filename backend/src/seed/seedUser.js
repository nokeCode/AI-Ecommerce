require('dotenv').config();
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const User = require('../models/User');

async function seedUsers() {
  await connectDB();
  console.log('Seed User - DB utilisée :', mongoose.connection.db.databaseName);

  await User.deleteMany({});

  const demoUsers = [
    { id: 1, name: 'Camille Martin', email: 'camille.martin@example.com', password: 'password123', role: 'customer' },
    { id: 2, name: 'Lucas Bernard', email: 'lucas.bernard@example.com', password: 'password123', role: 'customer' },
    { id: 3, name: 'Sarah Leroy', email: 'sarah.leroy@example.com', password: 'password123', role: 'customer' },
    { id: 4, name: 'Nicolas Dubois', email: 'nicolas.dubois@example.com', password: 'password123', role: 'customer' },
    { id: 5, name: 'Julie Moreau', email: 'julie.moreau@example.com', password: 'password123', role: 'customer' },
    { id: 6, name: 'Hugo Girard', email: 'hugo.girard@example.com', password: 'password123', role: 'customer' }
  ];

  const inserted = await User.insertMany(demoUsers);
  console.log(`Seed User - users créés : ${inserted.length}`);
  return inserted;
}

module.exports = { seedUsers };

