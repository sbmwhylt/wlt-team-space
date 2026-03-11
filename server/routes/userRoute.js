import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, authorizeRoles("admin", "super-admin"), getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, authorizeRoles("admin", "super-admin"), updateUser);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "super-admin"), deleteUser);

export default router;