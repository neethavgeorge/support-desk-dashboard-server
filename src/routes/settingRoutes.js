import express from "express";
import auth from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import {getSettings, updateSettings} from "../controllers/settingsController.js"

const  router = express.Router();

router.put("/theme", auth, updateSettings);
router.get("/theme", auth,getSettings);

export default router

