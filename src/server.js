require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  await connectDB();

  app.get("/", (_req, res) => res.send("Support Desk API is running"));

  // routes
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/tickets", require("./routes/ticketRoutes"));
  app.use("/api/admin", require("./routes/adminRoutes"));
  app.use("/api/users", require("./routes/userPrefRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));


  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
