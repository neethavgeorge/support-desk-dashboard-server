// const express = require("express");
// const auth = require("../middleware/authMiddleware");
// const requireRole = require("../middleware/roleMiddleware");
// const {
//   createTicket, getTickets, getTicketById,
//   updateTicket, assignTicket, deleteTicket
// } = require("../controllers/ticketController");
import express from "express";
import auth from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js"
import { createTicket, getTickets, getTicketById,
  updateTicket, assignTicket, deleteTicket, resolveTicket } from "../controllers/ticketController.js";

const  router = express.Router();

// create + list
router.post("/", auth, requireRole("employee", "support", "admin"), createTicket);
router.get("/", auth, getTickets);

// detail
router.get("/:id", auth, getTicketById);
router.put("/:id", auth, requireRole("employee", "support", "admin"), updateTicket);

// assign (admin)
router.put("/:id/assign", auth, requireRole("admin"), assignTicket);
//resolve
router.put("/:id/resolve", auth, requireRole("support"), resolveTicket);

// delete (admin)
router.delete("/:id", auth, requireRole("admin"), deleteTicket);

export default router
