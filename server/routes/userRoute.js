import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authMiddleware, isAdminOrSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, isAdminOrSuperAdmin, getAllUsers);
router.get("/:id", authMiddleware, isAdminOrSuperAdmin, getUserById);
router.put("/:id", authMiddleware, isAdminOrSuperAdmin, updateUser);
router.delete("/:id", authMiddleware, isAdminOrSuperAdmin, deleteUser);

export default router;