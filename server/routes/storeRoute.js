import express from "express";
import {
  createStore,
  getAllStores,
  getStoreById,
  deleteStore,
} from "../controllers/storeController.js";

const router = express.Router();

router.post("/", createStore);
router.get("/", getAllStores);
router.get("/:id", getStoreById);
router.delete("/:id", deleteStore);

export default router;
