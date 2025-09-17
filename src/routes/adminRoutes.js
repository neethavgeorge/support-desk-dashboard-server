import express from "express";
import auth from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";
import { getUsers, updateUser, deleteUser, getSupportUsers, manageUsers } from "../controllers/adminController.js";

const  router = express.Router();

router.use(auth, requireRole("admin"));
router.get("/users", auth,getUsers);
router.put("/users/:id", auth,updateUser);
router.delete("/users/:id",auth, deleteUser);
router.get("/support-users", auth,getSupportUsers);
router.put("/users/manage/:id", auth,manageUsers);

export default router


