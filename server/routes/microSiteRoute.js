import express from "express";
import {
  createMicroSite,
  getAllMicroSites,
  getMicroSiteByTypeAndSlug,
  updateMicroSite,
  deleteMicroSite,
  uploadImages,
} from "../controllers/micrositeController.js";
import { updateStoresForMicrosite } from "../controllers/storeController.js";

const router = express.Router();

router.post("/", createMicroSite);
router.get("/", getAllMicroSites);
router.get("/:type/:slug", getMicroSiteByTypeAndSlug);
router.put("/:id", updateMicroSite);
router.delete("/:id", deleteMicroSite);
router.post("/upload", uploadImages);
router.put("/:micrositeId/stores", updateStoresForMicrosite);

export default router;
