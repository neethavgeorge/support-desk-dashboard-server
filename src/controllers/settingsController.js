// routes/settingsRoutes.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();


export const  getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("settings");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const  updateSettings = async (req, res) => {
  try {
    console.log("Incoming theme update:", req.body, "User:", req.user);
    const { theme } = req.body;
console.log("USER: "+req.user.id)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (theme) user.settings.theme = theme;

    await user.save();
    res.json({ message: "Settings updated", settings: user.settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default router;
