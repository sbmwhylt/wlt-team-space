import express from "express";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const router = express.Router();

async function extractTextFromPdf(buffer) {
  const data = new Uint8Array(buffer);
  const pdf = await pdfjsLib.getDocument({ data, useWorkerFetch: false, isEvalSupported: false }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
}

function extractCardsFromText(text) {
  const records = [];
  const blocks = text.split(/(?=Acc:\s*\d+)/);

  for (const block of blocks) {
    const acc = block.match(/Acc:\s*(\d+)/);
    const cardno = block.match(/CARDNO:\s*([\d\s]{15,25}?)(?=\s*PIN:)/);
    const pin = block.match(/PIN:\s*(\d{4})/);
    const eaid = block.match(/EAID:\s*([A-Z0-9]{8,})/);

    if (acc && cardno && pin && eaid) {
      records.push({
        account: acc[1].trim(),
        card_number: cardno[1].replace(/\s+/g, "").trim(),
        pin: pin[1].trim(),
        eaid: eaid[1].trim(),
      });
    }
  }

  return records;
}

router.post("/tools/pdf-to-csv", async (req, res) => {
  try {
    if (!req.files?.pdf) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    const file = req.files.pdf;

    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Uploaded file must be a PDF." });
    }

    const text = await extractTextFromPdf(file.data);

    if (!text.trim()) {
      return res.json({ csv: "EMPTY" });
    }

    const records = extractCardsFromText(text);

    if (records.length === 0) {
      return res.json({ csv: "EMPTY" });
    }

    const header = "Account,Card Number,PIN,EAID";
    const rows = records.map(
      (r) => `${r.account},${r.card_number},${r.pin},${r.eaid}`
    );
    const csv = [header, ...rows].join("\n");

    res.json({ csv, count: records.length });
  } catch (error) {
    console.error("PDF-to-CSV error:", error);
    res.status(500).json({ error: "Failed to convert PDF to CSV." });
  }
});

export default router;
