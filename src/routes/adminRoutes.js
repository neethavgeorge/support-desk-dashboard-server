const express = require("express");
const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { getUsers, updateUser, deleteUser } = require("../controllers/adminController");

const router = express.Router();

router.use(auth, requireRole("admin"));
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
