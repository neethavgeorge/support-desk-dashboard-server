import Ticket from "../models/Ticket.js";

// Get dashboard stats and tickets
export const  getDashboardData = async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const pending = await Ticket.countDocuments({ status: "Pending" });
    const completed = await Ticket.countDocuments({ status: "Completed" });
    const overdue = await Ticket.countDocuments({ status: "Overdue" });

    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("id issue employee status");

    res.json({
      stats: { total, pending, completed, overdue },
      tickets,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error" });
  }
};


