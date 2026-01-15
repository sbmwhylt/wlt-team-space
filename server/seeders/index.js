import dotenv from "dotenv";
import sequelize from "../config/db.js";
import { userSeeder } from "./userSeeder.js";
import { microSiteSeeder } from "./microSiteSeeder.js";
import { storeSeeder } from "./storeSeeder.js";

dotenv.config();

export const runSeeders = async () => {
  try {
    console.log("🌱 Running seeders...");

    await sequelize.sync({ force: true });
    await userSeeder();
    await microSiteSeeder();
    await storeSeeder();
    
    console.log("🌱 Seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder error:", err);
    process.exit(1);
  }
};

runSeeders();
