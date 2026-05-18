import express from "express";
import authRoutes from "./authRoute.js";
import userRoutes from "./userRoute.js";
import microSiteRoutes from "./microSiteRoute.js";
import storeRoutes from "./storeRoute.js";
import noticePostRoutes from "./noticePostRoute.js";
import dashboardPostRoutes from "./dashboardPostRoute.js";
import calendarRoutes from "./calendarRoute.js";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);

// Protected routes
router.use("/users", userRoutes);
router.use("/microsites", microSiteRoutes);
router.use("/stores", storeRoutes);
router.use("/notice-posts", noticePostRoutes);
router.use("/dashboard-posts", dashboardPostRoutes);
router.use("/calendar", calendarRoutes);

export default router;
