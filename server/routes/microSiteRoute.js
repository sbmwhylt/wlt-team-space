import express from "express";
import {
  getAllMicroSites,
  getMicroSiteById,
  createMicroSite,
  updateMicroSite,
  deleteMicroSite,
} from "../controllers/micrositeController.js";

const router = express.Router();

router.get("/", getAllMicroSites);
router.get("/:id", getMicroSiteById);
router.get("/:slug", getAllMicroSites);
router.post("/", createMicroSite);
router.put("/:id", updateMicroSite);
router.delete("/:id", deleteMicroSite);

export default router;
