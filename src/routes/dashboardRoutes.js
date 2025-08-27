const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController.js");

const router = express.Router();

router.get("/", getDashboardData);

module.exports = router;
