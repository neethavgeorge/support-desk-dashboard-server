import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role = "employee" } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password: password, role });
    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, theme: user.theme }
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Await instead of callback
    const user = await User.findOne({ email,is_active: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
   
    // Compare password
    const isMatch = await bcrypt.compare(password.trim(), user.password.trim());
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials "});
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
console.log("TOKEN: "+token+" "+user)
    // res.json({ token, user });
     res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

export const logout = async (_req, res) => {
  // Stateless JWT – client should drop token. Optionally implement token blacklist if needed.
  res.json({ success: true, message: "Logged out" });
};
