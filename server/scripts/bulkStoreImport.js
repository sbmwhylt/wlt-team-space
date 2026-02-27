import fs from "fs";
import path from "path";
import csv from "csv-parser";
import Store from "../models/Store.js";
import Microsite from "../models/Microsites.js";
import sequelize from "../config/db.js";

await sequelize.authenticate();
console.log("📦 Connected to database");

// Grab every CSV file in the stores folder
const storesDir = "./data/stores";
const files = fs.readdirSync(storesDir).filter((f) => f.endsWith(".csv"));

for (const file of files) {
  console.log(`\n📂 Importing: ${file}`);
  const stores = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(path.join(storesDir, file))
      .pipe(csv())
      .on("data", (row) => stores.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  for (const row of stores) {
    const microsite = await Microsite.findOne({
      where: { slug: row.micrositeSlug },
    });

    if (!microsite) {
      console.log(
        `❌ Skipped: ${row.name} (microsite '${row.micrositeSlug}' not found)`,
      );
      continue;
    }

    await Store.create({
      name: row.name,
      latitude: row.latitude,
      longitude: row.longitude,
      micrositeId: microsite.id,
    });

    console.log(`✅ Added: ${row.name}`);
  }
}

console.log("\n🎉 All imports finished!");
process.exit();
