import db from "../models/index.js";

const Store = db.Store;

export const storeSeeder = async () => {
  try {
    const existing = await Store.findOne({
      where: {
        micrositeId: 1,
        name: "Annas Candles - Hand Crafted Soy Candles & Reed Diffusers",
      },
    });
    if (existing) {
      console.log("⚠️ Store already exists. Skipping seeding.");
      return;
    }

    const stores = await Store.bulkCreate([
      {
        name: "Annas Candles - Hand Crafted Soy Candles & Reed Diffusers",
        latitude: -28.8016841,
        longitude: 151.8417212,
        micrositeId: 1,
      },
      {
        name: "Andersens Stanthorpe",
        latitude: -28.6580644,
        longitude: 151.9344512,
        micrositeId: 1,
      },
    ]);

    console.log("✅ Store seeded successfully");
    return stores;
  } catch (error) {
    console.error("❌ Error seeding store:", error);
  }
};
