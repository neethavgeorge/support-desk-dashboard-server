const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, async (req, res) => {
  const ticket = await Ticket.create({ ...req.body, employeeId: req.user._id });
  res.json(ticket);
});

router.get("/", protect, async (req, res) => {
  const tickets = await Ticket.find().populate("employeeId");
  res.json(tickets);
});

module.exports = router;
