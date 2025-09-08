import { userSeeder } from "./userSeeder.js";

export const runSeeders = async () => {
  console.log("🌱 Running seeders...");

  // ----------------- Add more seeders here as needed
  await userSeeder();

  console.log("🌱 Seeding completed!");
};
