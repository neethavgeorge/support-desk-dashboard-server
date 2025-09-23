// const Ticket = require("../models/Ticket");
import Counter from "../models/Counter.js"
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import { calculateDueDate } from "../utils/calculateDueDate.js";
import { sendEmail } from "../utils/sendEmail.js";


// Create ticket (employee)
export const createTicket = async (req, res) => {
  try {
     console.log("Counter model:", Counter);
     let counter = await Counter.findOneAndUpdate(
      { name: "ticketId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true } // create if doesn't exist
    );

    const { title, description, priority} = req.body;
    if (!title || !description || !priority) return res.status(400).json({ message: "Missing fields" });

    const newTicket = new Ticket({
      ticketId: counter.value, 
      title,
      description,
      priority,
      status: "pending",
      createdBy: req.user._id
    });
newTicket.dueDate = calculateDueDate(newTicket.priority);
console.log("TICKET: "+newTicket)
await newTicket.save();
 await sendEmail({
      to: req.user.email,
      subject: "Ticket Created",
      htmlContent: `
        <h3> Dear ${req.user.name},A request for support has been created and Ticket ID is #${newTicket.ticketId}</h3>
       `,
    });
    res.status(201).json({ success: true, newTicket });
  } catch (err) {
    
    res.status(500).json({ message: "Create ticket failed", error: err.message });
  }
  
};

// Get tickets (employee sees own; support/admin see all)
// exports.getTickets = async (req, res) => {
//   try {
//     const filter = ["admin", "support"].includes(req.user.role) ? {} : { createdBy: req.user._id };
//     const tickets = await Ticket.find(filter)
//       .populate("createdBy", "name email role")
//       .populate("assignedTo", "name email role")
//       .sort({ createdAt: -0 });
//     res.json({ success: true, tickets });
//   } catch (err) {
//     res.status(500).json({ message: "Fetch tickets failed", error: err.message });
//   }
// };

export const getTicketById = async (req, res) => {
  try {
    const t = await Ticket.findById(req.params.id)
    .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");
    if (!t) return res.status(404).json({ message: "Ticket not found" });

    // employees can only see their own
    if (req.user.role === "employee" && String(t.createdBy._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    res.json({ success: true, ticket: t });
  } catch (err) {
    res.status(500).json({ message: "Fetch ticket failed", error: err.message });
  }
};

// Update ticket (status/details). Employees can edit their own title/description; support/admin can update status/assign.
export const updateTicket = async (req, res) => {
  try {
    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Ticket not found" });

    const isOwner = String(t.createdBy) === String(req.user._id);
    const isStaff = ["support", "admin"].includes(req.user.role);

    const { title, description, priority, status } = req.body;

    if (req.user.role === "employee" && !isOwner)
      return res.status(403).json({ message: "Forbidden" });

    if (isOwner) {
      if (title) t.title = title;
      if (description) t.description = description;
      if (priority) t.priority = priority;
    }

    if (isStaff) {
      if (status) t.status = status;
    }

    const saved = await t.save();
    res.json({ success: true, ticket: saved });
  } catch (err) {
    res.status(500).json({ message: "Update ticket failed", error: err.message });
  }
};

// Assign ticket (support/admin)
export const assignTicket = async (req, res) => {
  try {
    const { supportId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
console.log("SUPPORT: "+supportId)
    const supportUser = await User.findById(supportId);
    console.log("SUPPORTUSER: "+supportUser)
    if (!supportUser || supportUser.role !== "support") {
      return res.status(400).json({ message: "Invalid support user" });
    }

    ticket.assignedTo = supportUser._id;
    ticket.status = "in-progress";
    await ticket.save();
 await sendEmail({
      to: ticket.createdBy.email,
      subject: "Ticket Assigned",
      htmlContent: `
        <h3>Your ticket #${ticket.ticketId} has been assigned</h3>
        <p>Assigned to: ${ticket.assignedTo}</p>
      `,
    });
    res.json({ message: "Ticket assigned successfully", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error assigning ticket" });
  }
};

// Delete ticket (admin only)
export const deleteTicket = async (req, res) => {
  try {
    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Ticket not found" });
    await t.deleteOne();
    res.json({ success: true, message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete ticket failed", error: err.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const { role, id } = req.user; // comes from JWT

    let tickets;

    if (role === "admin") {
      tickets = await Ticket.find().populate("createdBy assignedTo", "name email role");
    } else if (role === "support") {
      tickets = await Ticket.find({ assignedTo: id }).populate("createdBy assignedTo", "name email role");
    } else {
      // employee -> only tickets created by self
      tickets = await Ticket.find({ createdBy: id }).populate("createdBy assignedTo", "name email role");
    }

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;

    // Update ticket status to "Resolved"
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status: "closed", resolvedAt: new Date() },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
if(ticket){
   await sendEmail({
      to: userEmail,
      subject: "Issue Resolved",
      htmlContent: `
        <h3>Your ticket #${ticket.ticketId} has been resolved. Please check..</h3>
      `,
    });
}
    res.status(200).json({ message: "Ticket resolved successfully", ticket });
  } catch (error) {
    console.error("Resolve Ticket Error:", error);
    res.status(500).json({ message: "Error resolving ticket", error: error.message });
  }
};
