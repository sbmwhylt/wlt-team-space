import express from "express";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  createDashboardPost,
  getAllDashboardPosts,
  getDashboardPostById,
  updateDashboardPost,
  deleteDashboardPost,
} from "../controllers/dashboardPostController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllDashboardPosts);
router.get("/:id", getDashboardPostById);

router.post("/", authorizeRoles("admin", "super-admin"), createDashboardPost);
router.put("/:id", authorizeRoles("admin", "super-admin"), updateDashboardPost);
router.delete("/:id", authorizeRoles("admin", "super-admin"), deleteDashboardPost);

export default router;
