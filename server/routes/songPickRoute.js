import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createSongPick,
  getAllSongPicks,
  deleteSongPick,
} from "../controllers/songPickController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllSongPicks);

// Any signed-in user can add a song. Removal is checked per-song in the
// controller: your own pick, or an admin.
router.post("/", createSongPick);
router.delete("/:id", deleteSongPick);

export default router;
