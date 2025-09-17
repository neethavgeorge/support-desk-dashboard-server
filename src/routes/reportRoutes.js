import express from "express";
import { getReports } from "../controllers/reportsController.js";
import auth from "../middleware/authMiddleware.js";

const  router = express.Router();

router.get("/", auth,getReports);


export default router