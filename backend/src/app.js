const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const searchRoutes = require('./routes/searchRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const chatRoutes = require('./routes/chatRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/chat", chatRoutes);
app.use(
  '/api/search',
  searchRoutes
);
app.use("/api/payment", paymentRoutes);

module.exports = app;
