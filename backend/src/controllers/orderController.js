const Product = require('../models/Product');

const products = await Product.find();

console.log(products.length);