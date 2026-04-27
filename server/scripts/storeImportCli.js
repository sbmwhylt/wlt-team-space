import fs from "fs";
import path from "path";
import csv from "csv-parser";
import Store from "../models/Store.js";
import Microsite from "../models/Microsites.js";
import sequelize from "../config/db.js";

// Usage:
//   node --env-file=.env scripts/storeImportCli.js import fraser-coast
//   node --env-file=.env scripts/storeImportCli.js undo fraser-coast
//
// The file name argument can be with or without the .csv extension.

const [action, fileArg] = process.argv.slice(2);

if (!action || !fileArg || !["import", "undo"].includes(action)) {
  console.error("Usage: storeImportCli.js <import|undo> <filename>");
  console.error("Example: storeImportCli.js import fraser-coast");
  process.exit(1);
}

const fileName = fileArg.endsWith(".csv") ? fileArg : `${fileArg}.csv`;
const filePath = path.join("./data/stores", fileName);

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

await sequelize.authenticate();
console.log("📦 Connected to database");

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

console.log(`📄 ${fileName}: ${rows.length} rows\n`);

if (action === "import") {
  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      const microsite = await Microsite.findOne({
        where: { slug: row.micrositeSlug },
      });

      if (!microsite) {
        console.log(`⚠️  Skipped: ${row.name} (microsite '${row.micrositeSlug}' not found)`);
        skipped++;
        continue;
      }

      const existing = await Store.findOne({
        where: { name: row.name, micrositeId: microsite.id },
      });

      if (existing) {
        console.log(`⏭️  Skipped (already exists): ${row.name}`);
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

  console.log(`\n🎉 Import finished! Added: ${added} | Skipped: ${skipped} | Failed: ${failed}`);
}

if (action === "undo") {
  let deleted = 0;
  let skipped = 0;

  for (const row of rows) {
    const microsite = await Microsite.findOne({
      where: { slug: row.micrositeSlug },
    });

    if (!microsite) {
      console.log(`⏭️  Skipped (microsite not found): ${row.name}`);
      skipped++;
      continue;
    }

    const existing = await Store.findOne({
      where: { name: row.name, micrositeId: microsite.id },
    });

    if (!existing) {
      console.log(`⏭️  Skipped (not found): ${row.name}`);
      skipped++;
      continue;
    }

    await existing.destroy();
    console.log(`🗑️  Deleted: ${row.name}`);
    deleted++;
  }

  console.log(`\n✅ Undo finished! Deleted: ${deleted} | Skipped: ${skipped}`);
}

process.exit();
