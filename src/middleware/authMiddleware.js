import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Always validate decoded.id
    if (!decoded?.id) {
      return res.status(401).json({ message: "Not authorized, invalid payload" });
    }

    const user = await User.findById(decoded.id).select("-password");
console.log("AUTH USER: "+user.id)
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user; // attach user to req object
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

export default auth;