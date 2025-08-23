const express = require("express");
const { signup, login, profile, logout } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/profile", auth, profile);

module.exports = router;
