const User = require("../models/User");

exports.getUsers = async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, users });
};

exports.updateUser = async (req, res) => {
  const { role, theme, name } = req.body;
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  if (role) user.role = role;
  if (theme) user.theme = theme;
  if (name) user.name = name;

  const saved = await user.save();
  res.json({ success: true, user: saved });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await user.deleteOne();
  res.json({ success: true, message: "User deleted" });
};
