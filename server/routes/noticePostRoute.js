import express from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import {
  createNoticePost,
  getAllNoticePosts,
  getNoticePostById,
  updateNoticePost,
  deleteNoticePost,
} from "../controllers/noticePostController.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET - all authenticated users can view
router.get("/", getAllNoticePosts);
router.get("/:id", getNoticePostById);

// CUD - only admin and super-admin can create/update/delete
router.post("/", authorizeRoles("admin", "super-admin"), createNoticePost);
router.put("/:id", authorizeRoles("admin", "super-admin"), updateNoticePost);
router.delete("/:id", authorizeRoles("admin", "super-admin"), deleteNoticePost);

export default router;
