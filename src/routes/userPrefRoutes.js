const express = require("express");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.patch("/theme", auth, async (req, res) => {
  try {
    const { theme } = req.body;
    if (!["light", "dark"].includes(theme)) return res.status(400).json({ message: "Invalid theme" });
    req.user.theme = theme;
    await req.user.save();
    res.json({ success: true, theme });
  } catch (err) {
    res.status(500).json({ message: "Update theme failed", error: err.message });
  }
});

module.exports = router;
