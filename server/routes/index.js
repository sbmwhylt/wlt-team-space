import express from "express";
import authRoutes from "./authRoute.js";
import userRoutes from "./userRoute.js";
import microSiteRoutes from "./microSiteRoute.js";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);

// Protected routes
router.use("/users", userRoutes);
router.use("/microsites", microSiteRoutes);


export default router;
