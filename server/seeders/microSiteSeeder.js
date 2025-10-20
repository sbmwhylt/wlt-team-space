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
      banner: "https://i.pinimg.com/736x/94/e1/0e/94e10ed02adca77a415490aac579a338.jpg",
      logo: "https://i.pinimg.com/736x/94/e1/0e/94e10ed02adca77a415490aac579a338.jpg",
      aboutDesc: "This is the default microsite.",
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
      mapLink: "https://maps.google.com/?q=default+location",
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
