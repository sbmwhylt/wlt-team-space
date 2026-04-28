import fs from "fs";
import path from "path";
import csv from "csv-parser";
import Store from "../models/Store.js";
import Microsite from "../models/Microsites.js";
import sequelize from "../config/db.js";

// Usage: node --env-file=.env scripts/undoImportProdStores.js
// Removes stores that were imported by importProdStores.js
// Only deletes records whose name + micrositeId match the CSV — nothing else is touched.

await sequelize.authenticate();
console.log("📦 Connected to database");

const storesDir = "./data/stores";
const files = fs.readdirSync(storesDir).filter((f) => f.endsWith(".csv"));

console.log(`Found ${files.length} store file(s) to process\n`);

let deleted = 0;
let skipped = 0;

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

  // Pre-check: see if none of the rows exist (nothing to delete)
  let noneExist = true;
  for (const row of rows) {
    const microsite = await Microsite.findOne({ where: { slug: row.micrositeSlug } });
    if (!microsite) continue;
    const existing = await Store.findOne({ where: { name: row.name, micrositeId: microsite.id } });
    if (existing) { noneExist = false; break; }
  }

  if (noneExist) {
    console.log(`⏭️  Skipped — data not found`);
    skipped += rows.length;
    console.log();
    continue;
  }

  for (const row of rows) {
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

    if (!existing) {
      skipped++;
      continue;
    }

    await existing.destroy();
    console.log(`🗑️  Deleted: ${row.name}`);
    deleted++;
  }

  console.log();
}

console.log(`✅ Undo finished! Deleted: ${deleted} | Skipped: ${skipped}`);
process.exit();
