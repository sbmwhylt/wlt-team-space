import fs from "fs";
import csv from "csv-parser";
import Microsite from "../models/Microsites.js";
import sequelize from "../config/db.js";

// Usage: node --env-file=.env scripts/undoImportMicrosites.js
// Removes microsites that were imported by importMicrosites.js
// Only deletes records whose slug matches the CSV — nothing else is touched.

await sequelize.authenticate();
console.log("📦 Connected to database");

const rows = [];

await new Promise((resolve, reject) => {
  fs.createReadStream("./data/data_Microsites.csv")
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

console.log(`Found ${rows.length} microsites in CSV\n`);

let deleted = 0;
let skipped = 0;

for (const row of rows) {
  const existing = await Microsite.findOne({ where: { slug: row.slug } });

  if (!existing) {
    console.log(`⏭️  Skipped (not found): ${row.name} (${row.slug})`);
    skipped++;
    continue;
  }

  await existing.destroy();
  console.log(`🗑️  Deleted: ${row.name} (${row.slug})`);
  deleted++;
}

console.log(
  `\n✅ Undo finished! Deleted: ${deleted} | Skipped: ${skipped}`,
);
process.exit();
