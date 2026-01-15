import db from "../models/index.js";

const store = db.Store;

export const storeSeeder = async () => {
  try {
    const existingStore = await store.findOne({
      where: {
        micrositeId: 4,
        name: "Annas Candles - Hand Crafted Soy Candles & Reed Diffusers",
      },
    });

    if (existingStore) {
      console.log("⚠️ Store already exists. Skipping seeding.");
      return;
    }

    await store.create({
      name: "Annas Candles - Hand Crafted Soy Candles & Reed Diffusers",
      latitude: -28.8016841,
      longitude: 151.8417212,
      micrositeId: 1,
    });

    console.log("✅ Store seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding store:", error);
  }
};
