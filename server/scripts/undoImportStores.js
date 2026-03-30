import fs from "fs";
import csv from "csv-parser";
import Store from "../models/Store.js";
import Microsite from "../models/Microsites.js";
import sequelize from "../config/db.js";

// Usage: node --env-file=.env scripts/undoImportStores.js
// Removes stores that were imported by importStores.js
// Matches by name + micrositeId — only those exact records are deleted.

await sequelize.authenticate();
console.log("📦 Connected to database");

const rows = [];

await new Promise((resolve, reject) => {
  fs.createReadStream("./data/data_Stores.csv")
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", resolve)
    .on("error", reject);
});

console.log(`Found ${rows.length} stores in CSV\n`);

let deleted = 0;
let skipped = 0;

for (const row of rows) {
  const microsite = await Microsite.findOne({
    where: { slug: row.micrositeSlug },
  });

  if (!microsite) {
    console.log(
      `⏭️  Skipped: ${row.name} (microsite '${row.micrositeSlug}' not found)`,
    );
    skipped++;
    continue;
  }

  const store = await Store.findOne({
    where: { name: row.name, micrositeId: microsite.id },
  });

  if (!store) {
    console.log(`⏭️  Skipped (not found): ${row.name}`);
    skipped++;
    continue;
  }

  await store.destroy();
  console.log(`🗑️  Deleted: ${row.name}`);
  deleted++;
}

console.log(
  `\n✅ Undo finished! Deleted: ${deleted} | Skipped: ${skipped}`,
);
process.exit();
