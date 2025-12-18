import express from "express";
import {
  createMicroSite,
  getAllMicroSites,
  getMicroSiteBySlug,
  updateMicroSite,
  deleteMicroSite,
  uploadImages,
} from "../controllers/micrositeController.js";

const router = express.Router();

// CRUD routes
router.post("/", createMicroSite);
router.get("/", getAllMicroSites);
router.get("/:slug", getMicroSiteBySlug);
router.put("/:id", updateMicroSite);
router.delete("/:id", deleteMicroSite);

// Image Upload (NO middleware needed!)
router.post("/upload", uploadImages);

export default router;
