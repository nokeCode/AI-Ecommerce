const express = require("express");
const {
  register,
  login,
  getProfile,
  getMyOrders,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);
router.get("/my-orders", authMiddleware, getMyOrders);

module.exports = router;
