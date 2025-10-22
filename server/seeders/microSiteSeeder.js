import db from "../models/index.js";

const Microsite = db.Microsite;

export const microSiteSeeder = async () => {
  try {
    const existingMicrosite = await Microsite.findOne({
      where: { name: "Default Microsite" },
    });
    if (existingMicrosite) {
      console.log("⚠️ Microsite already exists. Skipping seeding.");
      return;
    }
    await Microsite.create({
      name: "Fruit Bites",
      link: "https://fruitbites.com",
      slug: "fruit-bites",
      type: "consumer",
      banner:
        "https://i.pinimg.com/736x/f1/dc/1f/f1dc1f25812bf150a418d09e8406cb08.jpg",
      logo: "https://i.pinimg.com/736x/94/e1/0e/94e10ed02adca77a415490aac579a338.jpg",
      aboutDesc:
        "Fresh, fun, and full of flavor — Fruit Bites serves up delicious, healthy treats made from real fruit, perfect for any time of day.",
      footerDesc: "Default footer description.",
      socialLinks: {
        facebook: "https://facebook.com/default",
        twitter: "https://twitter.com/default",
        instagram: "https://instagram.com/default",
      },
      digitalCardOrderLink: "https://defaultmicrosite.com/digital-card",
      physicalCardOrderLink: "https://defaultmicrosite.com/physical-card",
      // bulkOrderLink: "https://defaultmicrosite.com/bulk-order",
      communityLink: "https://defaultmicrosite.com/community",
      mapLink:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.2758967082495!2d151.2127217765538!3d-33.8567799184377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae665e892fdd%3A0x3133f8d75a1ac251!2sSydney%20Opera%20House!5e0!3m2!1sen!2sph!4v1761119408630!5m2!1sen!2sph",
      marketingImgs: [
        "https://via.placeholder.com/300",
        "https://via.placeholder.com/300",
        "https://via.placeholder.com/300",
      ],
      marketingVids: [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      ],
    });
    console.log("✅ Microsite seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding microsite:", error);
  }
};
