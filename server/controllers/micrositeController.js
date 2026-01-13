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

    // Upload all single images
    const singleImages = [
      "banner",
      "physicalImg",
      "digitalImg",
      "physicalBulkImg",
      "digitalBulkImg",
    ];
    await Promise.all(
      singleImages.map(async (field) => {
        if (req.files?.[field]) {
          uploadedData[field] = await uploadToImageKit(req.files[field]);
        }
      })
    );

    // Upload multiple marketing images
    if (req.files?.marketingImgs) {
      const images = Array.isArray(req.files.marketingImgs)
        ? req.files.marketingImgs
        : [req.files.marketingImgs];
      uploadedData.marketingImgs = await Promise.all(
        images.map((file) => uploadToImageKit(file))
      );
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
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET ALL MICROSITES
export const getAllMicroSites = async (req, res) => {
  try {
    const microsites = await Microsite.findAll();
    res.json({ microsites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET MICROSITE BY SLUG
export const getMicroSiteByTypeAndSlug = async (req, res) => {
  try {
    const { type, slug } = req.params;
    const microsite = await Microsite.findOne({
      where: { slug, type },
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
// export const getMicroSiteById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const microsite = await Microsite.findByPk(id);
//     if (!microsite)
//       return res.status(404).json({ error: "Microsite not found" });
//     res.json({ microsite });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// -------------------- UPDATE MICROSITE
export const updateMicroSite = async (req, res) => {
  try {
    const { id } = req.params;
    const microsite = await Microsite.findByPk(id);
    if (!microsite)
      return res.status(404).json({ error: "Microsite not found" });
    await microsite.update(req.body);
    res.json({ msg: "Microsite updated successfully", microsite });
  } catch (err) {
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
    // Check if any files were uploaded
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
