const Ticket = require("../models/Ticket");

// Create ticket (employee)
exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority = "medium" } = req.body;
    if (!title || !description) return res.status(400).json({ message: "Missing fields" });

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ message: "Create ticket failed", error: err.message });
  }
};

// Get tickets (employee sees own; support/admin see all)
exports.getTickets = async (req, res) => {
  try {
    const filter = ["admin", "support"].includes(req.user.role) ? {} : { createdBy: req.user._id };
    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -0 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ message: "Fetch tickets failed", error: err.message });
  }
};

exports.getTicketById = async (req, res) => {
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
exports.updateTicket = async (req, res) => {
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
exports.assignTicket = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Ticket not found" });

    t.assignedTo = assignedTo || null;
    const saved = await t.save();
    res.json({ success: true, ticket: saved });
  } catch (err) {
    res.status(500).json({ message: "Assign ticket failed", error: err.message });
  }
};

// Delete ticket (admin only)
exports.deleteTicket = async (req, res) => {
  try {
    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Ticket not found" });
    await t.deleteOne();
    res.json({ success: true, message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete ticket failed", error: err.message });
  }
};
