import fs from "fs";
import path from "path";
import csv from "csv-parser";
import Store from "../models/Store.js";
import Microsite from "../models/Microsites.js";
import sequelize from "../config/db.js";

// Usage: node --env-file=.env scripts/undoBulkStoreImport.js
// Removes stores that were imported by bulkStoreImport.js
// Reads every CSV in data/stores/ and deletes matching records by name + micrositeId.

await sequelize.authenticate();
console.log("📦 Connected to database");

const storesDir = "./data/stores";
const files = fs.readdirSync(storesDir).filter((f) => f.endsWith(".csv"));

let totalDeleted = 0;
let totalSkipped = 0;

for (const file of files) {
  console.log(`\n📂 Processing: ${file}`);
  const rows = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(path.join(storesDir, file))
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  for (const row of rows) {
    const microsite = await Microsite.findOne({
      where: { slug: row.micrositeSlug },
    });

    if (!microsite) {
      console.log(
        `⏭️  Skipped: ${row.name} (microsite '${row.micrositeSlug}' not found)`,
      );
      totalSkipped++;
      continue;
    }

    const store = await Store.findOne({
      where: { name: row.name, micrositeId: microsite.id },
    });

    if (!store) {
      console.log(`⏭️  Skipped (not found): ${row.name}`);
      totalSkipped++;
      continue;
    }

    await store.destroy();
    console.log(`🗑️  Deleted: ${row.name}`);
    totalDeleted++;
  }
}

console.log(
  `\n✅ Undo finished! Deleted: ${totalDeleted} | Skipped: ${totalSkipped}`,
);
process.exit();
