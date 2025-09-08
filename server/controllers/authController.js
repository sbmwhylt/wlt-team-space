import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../models/index.js";

dotenv.config();
const User = db.User;

// ---------------------------- REGISTER

export const register = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password, role } = req.body;
    const existingUser = await User.findOne({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const existingUsername = await User.findOne({
      where: { userName },
    });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      role: role || "user", 
    });
    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------------------ LOGIN

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
