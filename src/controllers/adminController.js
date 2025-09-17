// const User = require("../models/User");
import User from "../models/User.js";


export const getUsers = async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, users });
};

export const updateUser = async (req, res) => {
  const { role, theme, name } = req.body;
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  if (role) user.role = role;
  if (theme) user.theme = theme;
  if (name) user.name = name;

  const saved = await user.save();
  res.json({ success: true, user: saved });
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await user.deleteOne();
  res.json({ success: true, message: "User deleted" });
};

export const getSupportUsers =  async (req, res) => {
  try {
    const users = await User.find({ role: "support" }).select("_id name email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const manageUsers = async (req, res) => {
  try {
    const { role, is_active } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, is_active },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
console.log("USERS: "+user);
    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};