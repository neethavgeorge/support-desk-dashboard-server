const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['new', 'pending', 'resolved'], default: 'new' },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
