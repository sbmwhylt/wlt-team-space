import db from "../models/index.js";
import slugify from "slugify";
import { uploadToImageKit } from "../middleware/upload.js";

const Microsite = db.Microsite;

// -------------------- CREATE MICROSITE
export const createMicroSite = async (req, res) => {
  try {
    const { name, socialLinks, ...rest } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Microsite name is required" });
    }

    const parsedSocialLinks =
      typeof socialLinks === "string"
        ? JSON.parse(socialLinks)
        : socialLinks || {};

    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Microsite.findOne({ where: { slug } });

    if (existing) {
      return res.status(400).json({ error: "Slug already exists" });
    }

    const uploadedData = {};
    const folderPath = "/microsites-assets";

    // Upload single images
    const singleImages = [
      "banner",
      "physicalImg",
      "digitalImg",
      "physicalBulkImg",
      "digitalBulkImg",
    ];

    for (const field of singleImages) {
      if (req.files?.[field]) {
        uploadedData[field] = await uploadToImageKit(
          req.files[field],
          folderPath,
        );
      }
    }

    // Upload marketing images
    const sections = [
      "brandAssets",
      "campaignsAndPromos",
      "socialContent",
      "participationContent",
    ];
    uploadedData.marketingImgs = {};

    for (const section of sections) {
      const fieldName = `marketingImgs_${section}`;

      if (req.files?.[fieldName]) {
        const images = Array.isArray(req.files[fieldName])
          ? req.files[fieldName]
          : [req.files[fieldName]];

        uploadedData.marketingImgs[section] = await Promise.all(
          images.map((file) => uploadToImageKit(file, folderPath)),
        );
      } else {
        uploadedData.marketingImgs[section] = null;
      }
    }

    const microsite = await Microsite.create({
      name,
      slug,
      ...rest,
      socialLinks: parsedSocialLinks,
      ...uploadedData,
    });

    res.status(201).json({
      msg: "Microsite created successfully",
      microsite,
    });
  } catch (err) {
    console.error("❌ CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET ALL MICROSITES
export const getAllMicroSites = async (req, res) => {
  try {
    const microsites = await Microsite.findAll({
      include: [
        {
          model: db.Store,
          as: "stores",
        },
      ],
    });
    res.json({ microsites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET MICROSITE BY SLUG
export const getMicroSiteBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const microsite = await Microsite.findOne({
      where: { slug },
      include: [
        {
          model: db.Store,
          as: "stores",
        },
      ],
    });
    if (!microsite) {
      return res.status(404).json({ error: "Microsite not found" });
    }
    res.json({ microsite });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET MICROSITE BY ID
export const getMicroSiteById = async (req, res) => {
  try {
    const { id } = req.params;
    const microsite = await Microsite.findByPk(id);
    if (!microsite)
      return res.status(404).json({ error: "Microsite not found" });
    res.json({ microsite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- UPDATE MICROSITE
export const updateMicroSite = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, socialLinks, marketingImgs, ...rest } = req.body;

    const microsite = await Microsite.findByPk(id);
    if (!microsite) {
      return res.status(404).json({ error: "Microsite not found" });
    }

    const parsedSocialLinks =
      typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks;

    const parsedMarketingImgs =
      typeof marketingImgs === "string"
        ? JSON.parse(marketingImgs)
        : marketingImgs;

    const uploadedData = {};
    const folderPath = "/microsites-assets";

    // Upload single images (only if new files uploaded)
    const singleImages = [
      "banner",
      "physicalImg",
      "digitalImg",
      "physicalBulkImg",
      "digitalBulkImg",
    ];

    for (const field of singleImages) {
      if (req.files?.[field]) {
        uploadedData[field] = await uploadToImageKit(
          req.files[field],
          folderPath,
        );
      }
    }

    // Handle marketing images
    const sections = [
      "brandAssets",
      "campaignsAndPromos",
      "socialContent",
      "participationContent",
    ];

    // Start with existing URLs from body (if provided)
    if (parsedMarketingImgs) {
      uploadedData.marketingImgs = parsedMarketingImgs;
    } else {
      uploadedData.marketingImgs = { ...microsite.marketingImgs };
    }

    // Upload any NEW files (this will override the URLs for those sections)
    for (const section of sections) {
      const fieldName = `marketingImgs_${section}`;
      if (req.files?.[fieldName]) {
        const images = Array.isArray(req.files[fieldName])
          ? req.files[fieldName]
          : [req.files[fieldName]];

        uploadedData.marketingImgs[section] = await Promise.all(
          images.map((file) => uploadToImageKit(file, folderPath)),
        );
      }
    }

    await microsite.update({
      ...(name && { name }),
      ...rest,
      ...(parsedSocialLinks && { socialLinks: parsedSocialLinks }),
      ...uploadedData,
    });

    res.json({ msg: "Microsite updated successfully", microsite });
  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// -------------------- DELETE MICROSITE
export const deleteMicroSite = async (req, res) => {
  try {
    const { id } = req.params;
    const microsite = await Microsite.findByPk(id);
    if (!microsite)
      return res.status(404).json({ error: "Microsite not found" });
    await microsite.destroy();
    res.json({ msg: "Microsite deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------- Handle ImageKit Upload
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    // Get the uploaded file(s)
    const uploadedFiles = req.files.image || req.files.images;
    // Handle single file
    if (!Array.isArray(uploadedFiles)) {
      const imageUrl = await uploadToImageKit(uploadedFiles);
      return res.status(200).json({
        msg: "Image uploaded successfully",
        url: imageUrl,
      });
    }
    // Handle multiple files
    const uploadPromises = uploadedFiles.map((file) => uploadToImageKit(file));
    const imageUrls = await Promise.all(uploadPromises);
    res.status(200).json({
      msg: "Images uploaded successfully",
      urls: imageUrls,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
