import fs from "fs";
import csv from "csv-parser";
import Microsite from "../models/Microsites.js";
import sequelize from "../config/db.js";

// Connect to database first
await sequelize.authenticate();
console.log("📦 Connected to database");

const microsites = [];

// Step 1: Read all rows from CSV
fs.createReadStream("./data/data_Microsites.csv")
  .pipe(
    csv({
      separator: ",",
      quote: '"',
      escape: '"',
      skipLines: 0,
      mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, ""), // Remove BOM!
    }),
  )
  .on("data", (row) => {
    console.log("Reading row:", row.name, row.slug);
    microsites.push(row);
  })
  .on("end", async () => {
    console.log(`\nFound ${microsites.length} microsites to import\n`);

    for (const row of microsites) {
      try {
        // Parse JSON fields - handle multi-line JSON
        let socialLinks = {};
        let marketingImgs = [];
        let marketingVids = [];

        try {
          socialLinks = row.socialLinks ? JSON.parse(row.socialLinks) : {};
        } catch (e) {
          console.log(`⚠️  Invalid socialLinks JSON for ${row.slug}`);
        }

        try {
          marketingImgs = row.marketingImgs
            ? JSON.parse(row.marketingImgs)
            : [];
        } catch (e) {
          console.log(`⚠️  Invalid marketingImgs JSON for ${row.slug}`);
        }

        try {
          marketingVids = row.marketingVids
            ? JSON.parse(row.marketingVids)
            : [];
        } catch (e) {
          console.log(`⚠️  Invalid marketingVids JSON for ${row.slug}`);
        }

        await Microsite.create({
          name: row.name,
          slug: row.slug,
          type: row.type || "consumer",
          email: row.email || null,
          phone: row.phone || null,
          banner: row.banner || null,
          aboutDesc: row.aboutDesc || null,
          socialLinks: socialLinks,
          digitalCardOrderLink: row.digitalCardOrderLink || null,
          physicalCardOrderLink: row.physicalCardOrderLink || null,
          communityLink: row.communityLink || null,
          businessLink: row.businessLink || null,
          marketingImgs: marketingImgs,
          marketingVids: marketingVids,
          physicalImg: row.physicalImg || null,
          digitalImg: row.digitalImg || null,
          physicalBulkImg: row.physicalBulkImg || null,
          digitalBulkImg: row.digitalBulkImg || null,
          color: row.color || null,
        });

        console.log(`✅ Added: ${row.name} (${row.slug})`);
      } catch (error) {
        console.log(`❌ Failed to add ${row.slug}:`, error.message);
      }
    }

    console.log("🎉 Import finished!");
    process.exit();
  });
