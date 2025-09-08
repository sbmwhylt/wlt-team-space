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
    const { firstName, lastName, userName, email, password, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      userName: userName || user.userName,
      email: email || user.email,
      password: hashedPassword,
      role: role || user.role,
    });
    res.json({
      msg: "User updated successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
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
