import express from "express";
import authRoutes from "./authRoute.js";
import userRoutes from "./userRoute.js";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);

// Protected routes
router.use("/users", userRoutes);


export default router;
