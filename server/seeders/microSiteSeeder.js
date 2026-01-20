import db from "../models/index.js";
import slugify from "slugify";

const Microsite = db.Microsite;

export const microSiteSeeder = async () => {
  try {
    const existing = await Microsite.findOne({ where: { name: "Stanthorpe" } });
    if (existing) return console.log("⚠️ Microsites already exist.");

    const microsites = await Microsite.bulkCreate(
      [
        {
          name: "Stanthorpe",
          slug: slugify("Stanthorpe", { lower: true }),
          type: "consumer",
          email: "secretary@stanthorpecoc.com.au",
          phone: "0746843877",
          banner:
            "https://ik.imagekit.io/wlt/uploads/Stanthorpe_Design_Element_3_YMmvoTCH0.png?updatedAt=1767591816806",
          aboutDesc:
            "Brought to you by the Community Bank Branch Stanthorpe (Bendigo Bank) along with Stanthorpe & Granite Belt Chamber of Commerce and operated by shop local experts Why Leave Town, the Stanthorpe Gift Card is aimed at encouraging people to shop local. Each card that is purchased can only be spent in local participating businesses...meaning all the money stays local!",
          socialLinks: {
            facebook: "https://www.facebook.com/stanthorpecoc/",
            website: "https://stanthorpecoc.au/",
          },
          digitalCardOrderLink:
            "https://www.whyleavetown.com/product/stanthorpe-digital-gift-card/",
          physicalCardOrderLink:
            "https://www.whyleavetown.com/product/stanthorpe-gift-card/",
          communityLink: "https://www.whyleavetown.com/community/stanthorpe/",
          businessLink:
            "https://forms.monday.com/forms/890cfe70c8a8dc371a450bad4c102a73?r=use1",
          color: "red",
        },
        {
          name: "Stanthorpe - Business Hub",
          slug: slugify("Stanthorpe - Business Hub", { lower: true }),
          type: "business",
          email: "secretary@stanthorpecoc.com.au",
          phone: "0746843877",
          banner:
            "https://ik.imagekit.io/wlt/uploads/Stanthorpe_Design_Element_4_dvPw6Gq0S.png?updatedAt=1767504589121",
          aboutDesc:
            "Brought to you by the Community Bank Branch Stanthorpe (Bendigo Bank) in partnership with the Stanthorpe & Granite Belt Chamber of Commerce and operated by local shopping experts Why Leave Town. The Stanthorpe Gift Card encourages people to shop locally, and every card purchased can only be spent at participating local businesses—keeping all the money within the community!",
          socialLinks: {
            facebook: "https://www.facebook.com/stanthorpecoc/",
            website: "https://stanthorpecoc.au/",
          },
          digitalCardOrderLink:
            "https://www.whyleavetown.com/product/stanthorpe-digital-gift-card/",
          physicalCardOrderLink:
            "https://www.whyleavetown.com/product/stanthorpe-gift-card/",
          communityLink: "https://www.whyleavetown.com/community/stanthorpe/",
          marketingImgs: [
            "https://ik.imagekit.io/wlt/uploads/Stanthorpe_Design_Element_6_3kVovopO8.png?updatedAt=1767591821063",
            "https://ik.imagekit.io/wlt/uploads/Stanthorpe_Design_Element_7_GrN62uaXs.png?updatedAt=1767591820884",
            "https://ik.imagekit.io/wlt/uploads/Stanthorpe_Design_Element_5_nPaOSHzgv.png?updatedAt=1767591820044",
            "https://ik.imagekit.io/wlt/uploads/Stanthorpe_Design_Element_4_dvPw6Gq0S.png?updatedAt=1767504589121",
          ],
        },
      ],
      { returning: true },
    );

    console.log("✅ Microsites seeded successfully");
    return microsites;
  } catch (error) {
    console.error("❌ Error seeding microsites:", error);
  }
};
