import mongoose from "mongoose";
import Counter from "../models/Counter.js"; 

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { 
      type: String, 
      enum: ["open", "pending", "in-progress", "resolved", "closed"], 
      default: "open" 
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    dueDate: { type: Date },
    resolvedAt: Date
  },
  { timestamps: true }
);

ticketSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "ticketId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.ticketId = counter.seq;
  }
  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
