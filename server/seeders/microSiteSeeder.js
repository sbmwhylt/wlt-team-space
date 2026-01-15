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
          mapLink:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1023.8604545538805!2d149.7835285620878!3d-30.327001928392992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ba7345ab7a394fd%3A0xa99b23f394edc764!2sCentre%20of%20Town!5e0!3m2!1sen!2sph!4v1761092847014!5m2!1sen!2sph",
          businessLink:
            "https://forms.monday.com/forms/890cfe70c8a8dc371a450bad4c102a73?r=use1",
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
      { returning: true }
    );

    console.log("✅ Microsites seeded successfully");
    return microsites;
  } catch (error) {
    console.error("❌ Error seeding microsites:", error);
  }
};
