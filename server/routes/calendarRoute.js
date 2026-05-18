import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getUpcomingEvents } from "../controllers/calendarController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/upcoming", getUpcomingEvents);

export default router;
