import express from "express";
import {
  createStore,
  createStores,
  getAllStores,
  getStoreById,
  deleteStore,
  updateStoresForMicrosite,
} from "../controllers/storeController.js";

const router = express.Router();

router.post("/single", createStore);
router.post("/", createStores);
router.get("/", getAllStores);
router.get("/:id", getStoreById);
router.put("/microsites/:micrositeId/stores", updateStoresForMicrosite);
router.delete("/:id", deleteStore);

export default router;
