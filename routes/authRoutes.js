const express = require("express");
const router = express.Router();

const authController =
require("../controllers/authController");

const authMiddleware =
require("../middleware/authMiddleware");

/* ================= AUTH ================= */

// Register user
router.post(
"/register",
authController.register
);

// Login user
router.post(
"/login",
authController.login
);

/* ================= PROFILE ================= */

// Get current logged in user
router.get(
"/me",
authMiddleware,
authController.getMe
);

// ⭐ Update user profile (name, email, password)
router.put(
"/update-profile",
authMiddleware,
authController.updateProfile
);

module.exports = router;
