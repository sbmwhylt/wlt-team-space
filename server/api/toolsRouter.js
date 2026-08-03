import express from "express";
import { convertPdfToCsv } from "../controllers/toolsController.js";

const router = express.Router();

router.post("/tools/pdf-to-csv", convertPdfToCsv);

export default router;
