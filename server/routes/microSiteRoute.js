import express from "express";
import {
  createMicroSite,
  getAllMicroSites,
  getMicroSiteBySlug,
  getMicroSiteById,
  updateMicroSite,
  deleteMicroSite,
  uploadMedia,
} from "../controllers/micrositeController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// CRUD routes
router.post("/", createMicroSite);
router.get("/", getAllMicroSites);
router.get("/slug/:slug", getMicroSiteBySlug);
router.get("/:id", getMicroSiteById);
router.put("/:id", updateMicroSite);
router.delete("/:id", deleteMicroSite);

// Upload route (form-data)
router.post("/:id/uploadMedia", upload.single("files"), uploadMedia);

export default router;
