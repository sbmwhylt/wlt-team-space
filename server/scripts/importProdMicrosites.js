import fs from "fs";
import csv from "csv-parser";
import Microsite from "../models/Microsites.js";
import sequelize from "../config/db.js";

// Usage: node --env-file=.env scripts/importProdMicrosites.js
// Imports from data/data_Prod_Microsites.csv
// Only adds NEW microsites — existing ones (matched by slug) are skipped, never overwritten or removed.

await sequelize.authenticate();
console.log("📦 Connected to database");

const rows = [];

await new Promise((resolve, reject) => {
  fs.createReadStream("./data/data_Prod_Microsites.csv")
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

let added = 0;
let skipped = 0;
let failed = 0;

for (const row of rows) {
  try {
    const existing = await Microsite.findOne({ where: { slug: row.slug } });
    if (existing) {
      console.log(`⏭️  Skipped (already exists): ${row.name} (${row.slug})`);
      skipped++;
      continue;
    }

    let socialLinks = {};
    let marketingImgs = [];
    let marketingVids = [];

    try {
      socialLinks = row.socialLinks ? JSON.parse(row.socialLinks) : {};
    } catch {
      console.log(`⚠️  Invalid socialLinks JSON for ${row.slug}`);
    }

    try {
      marketingImgs = row.marketingImgs ? JSON.parse(row.marketingImgs) : [];
    } catch {
      console.log(`⚠️  Invalid marketingImgs JSON for ${row.slug}`);
    }

    try {
      marketingVids = row.marketingVids ? JSON.parse(row.marketingVids) : [];
    } catch {
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
      socialLinks,
      digitalCardOrderLink: row.digitalCardOrderLink || null,
      physicalCardOrderLink: row.physicalCardOrderLink || null,
      communityLink: row.communityLink || null,
      businessLink: row.businessLink || null,
      marketingImgs,
      marketingVids,
      physicalImg: row.physicalImg || null,
      digitalImg: row.digitalImg || null,
      physicalBulkImg: row.physicalBulkImg || null,
      digitalBulkImg: row.digitalBulkImg || null,
      color: row.color || null,
    });

    console.log(`✅ Added: ${row.name} (${row.slug})`);
    added++;
  } catch (error) {
    console.log(`❌ Failed to add ${row.slug}:`, error.message);
    failed++;
  }
}

console.log(
  `\n🎉 Import finished! Added: ${added} | Skipped: ${skipped} | Failed: ${failed}`,
);
process.exit();
