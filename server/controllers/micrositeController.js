import db from "../models/index.js";

const Microsite = db.Microsite;

// -------------------- CREATE MICROSITE
export const createMicroSite = async (req, res) => {
  try {
    const microsite = await Microsite.create(req.body);
    res.status(201).json({ msg: "Microsite created successfully", microsite });
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
