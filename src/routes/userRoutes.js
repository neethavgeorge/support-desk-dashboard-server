import express from "express";
import auth from "../middleware/authMiddleware.js";
import { updateProfile, changePassword, getProfile } from "../controllers/userController.js";

const router = express.Router();

// get logged in user profile
router.get("/me", auth, getProfile);

// update profile (name, email, etc.)
router.put("/me", auth, updateProfile);

// change password
router.put("/me/password", auth, changePassword);

export default router;
