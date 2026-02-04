import fs from "fs";
import csv from "csv-parser";
import Store from "../models/Store.js";
import Microsite from "../models/Microsites.js";
import sequelize from "../config/db.js";

// Connect to database first
await sequelize.authenticate();
console.log("📦 Connected to database");

const stores = [];

// Step 1: Read all rows from CSV first
fs.createReadStream("./data/data_Stores.csv")
  .pipe(csv())
  .on("data", (row) => {
    stores.push(row);
  })
  .on("end", async () => {
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

    console.log("🎉 Import finished!");
    process.exit();
  });
