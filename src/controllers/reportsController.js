// routes/reportRoutes.js
import express from "express";
// import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import Ticket from "../models/Ticket.js";

const router = express.Router();

// ✅ Ticket statistics report
export const getReports= async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const pending = await Ticket.countDocuments({ status: "pending" });
    const inProgress = await Ticket.countDocuments({ status: "in-progress" });
    const resolved = await Ticket.countDocuments({ status: "resolved" });
    const closed = await Ticket.countDocuments({ status: "closed" });

    res.json({ total, pending, inProgress, resolved, closed });
  } catch (err) {
    res.status(500).json({ message: "Error generating report" });
  }
};

export default router;
