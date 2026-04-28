import fs from "fs";
import path from "path";
import csv from "csv-parser";
import Store from "../models/Store.js";
import Microsite from "../models/Microsites.js";
import sequelize from "../config/db.js";

// Usage: node --env-file=.env scripts/importProdStores.js
// Imports all CSV files from data/stores/
// Only adds NEW stores — existing ones (matched by name + micrositeId) are skipped, never overwritten or removed.

await sequelize.authenticate();
console.log("📦 Connected to database");

const storesDir = "./data/stores";
const files = fs.readdirSync(storesDir).filter((f) => f.endsWith(".csv"));

console.log(`Found ${files.length} store file(s) to process\n`);

let added = 0;
let skipped = 0;
let failed = 0;

for (const file of files) {
  const filePath = path.join(storesDir, file);
  const rows = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(
        csv({
          separator: ",",
          quote: '"',
          escape: '"',
          skipLines: 0,
          mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, ""),
        }),
      )
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`📄 ${file}: ${rows.length} rows`);

  // Pre-check: see if all rows already exist
  let allExist = true;
  for (const row of rows) {
    const microsite = await Microsite.findOne({ where: { slug: row.micrositeSlug } });
    if (!microsite) continue;
    const existing = await Store.findOne({ where: { name: row.name, micrositeId: microsite.id } });
    if (!existing) { allExist = false; break; }
  }

  if (allExist) {
    console.log(`⏭️  Skipped — all data already exists`);
    skipped += rows.length;
    console.log();
    continue;
  }

  for (const row of rows) {
    try {
      const microsite = await Microsite.findOne({
        where: { slug: row.micrositeSlug },
      });

      if (!microsite) {
        skipped++;
        continue;
      }

      const existing = await Store.findOne({
        where: { name: row.name, micrositeId: microsite.id },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await Store.create({
        name: row.name,
        latitude: row.latitude,
        longitude: row.longitude,
        micrositeId: microsite.id,
      });

      console.log(`✅ Added: ${row.name}`);
      added++;
    } catch (error) {
      console.log(`❌ Failed to add ${row.name}:`, error.message);
      failed++;
    }
  }

  console.log();
}

console.log(
  `🎉 Import finished! Added: ${added} | Skipped: ${skipped} | Failed: ${failed}`,
);
process.exit();
