const express = require("express")
const cors = require("cors");
// const connectDB = require("./config/db");
// connectDB();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://neethavgeorge:pdcA3wbXnMJNu2A0@supportdesk.kxsxd76.mongodb.net/?retryWrites=true&w=majority&appName=supportdesk");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
const app = express()
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());
// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Support Desk Server is Live");
});




// app.listen(port,()=>{
//     console.log("Server running...")
// })

const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  });
};

startServer();
