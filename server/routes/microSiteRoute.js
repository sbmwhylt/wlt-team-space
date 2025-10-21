import express from "express";
import {
  getAllMicroSites,
  getMicroSiteById,
  createMicroSite,
  updateMicroSite,
  deleteMicroSite,
  getMicroSiteBySlug,
} from "../controllers/micrositeController.js";

const router = express.Router();

router.get("/", getAllMicroSites);
router.get("/:slug", getMicroSiteBySlug);
router.get("/:id", getMicroSiteById);
router.post("/", createMicroSite);
router.put("/:id", updateMicroSite);
router.delete("/:id", deleteMicroSite);

export default router;
