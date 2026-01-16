import db from "../models/index.js";

const Store = db.Store;
const Microsite = db.Microsite;

// -------------------- CREATE STORE
export const createStore = async (req, res) => {
  try {
    const { name, latitude, longitude, micrositeId } = req.body;

    // Check all required fields
    if (!name || !latitude || !longitude || !micrositeId) {
      return res.status(400).json({
        error:
          "All fields are required (name, latitude, longitude, micrositeId)",
      });
    }

    // Verify the microsite exists before creating store
    const microsite = await Microsite.findByPk(micrositeId);
    if (!microsite) {
      return res.status(404).json({
        error: "Microsite not found",
      });
    }

    // Create the store with the pinned location
    const store = await Store.create({
      name,
      latitude,
      longitude,
      micrositeId,
    });

    // Return store with microsite info
    res.status(201).json({
      store: {
        ...store.toJSON(),
        microsite: {
          id: microsite.id,
          name: microsite.name,
        },
      },
    });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- GET ALL MICROSITES (for dropdown/selection)
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json({ stores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- GET STORE BY ID
export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.json({ store });
  } catch (error) {
    console.error("Error fetching store:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//-------------------- DELETE STORE
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    await store.destroy();
    res.json({ msg: "Store deleted successfully" });
  } catch (error) {
    console.error("Error deleting store:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
