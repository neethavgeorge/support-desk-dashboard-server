const express = require("express");
const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  createTicket, getTickets, getTicketById,
  updateTicket, assignTicket, deleteTicket
} = require("../controllers/ticketController");

const router = express.Router();

// create + list
router.post("/", auth, requireRole("employee", "support", "admin"), createTicket);
router.get("/", auth, getTickets);

// detail
router.get("/:id", auth, getTicketById);
router.put("/:id", auth, requireRole("employee", "support", "admin"), updateTicket);

// assign (support/admin)
router.patch("/:id/assign", auth, requireRole("support", "admin"), assignTicket);

// delete (admin)
router.delete("/:id", auth, requireRole("admin"), deleteTicket);

module.exports = router;
