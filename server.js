const express = require("express")
const cors = require("cors");
// const connectDB = require("./config/db");
// connectDB();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
const app = express()
const port = process.env.PORT
// const userRoutes = require("./routes/userRoutes");
// const ticketRoutes = require("./routes/ticketRoutes");

app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("<h1>Suppot Desk</h1>")
})

app.listen(port,()=>{
    console.log("Server running...")
})
