import db from "../models/index.js";
import bcrypt from "bcrypt";

const User = db.User;

// -------------------- GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    await user.update(req.body);
    const { password, ...userWithoutPassword } = user.toJSON();
    res.json({ msg: "User updated successfully", user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
