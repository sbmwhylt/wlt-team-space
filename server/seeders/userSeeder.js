import bcrypt from "bcrypt";
import db from "../models/index.js";

const User = db.User;

export const userSeeder = async () => {
  try {
    const existingUser = await User.findOne({
      where: { role: "super-admin" },
    });
    if (existingUser) {
      console.log("⚠️ User already exists. Skipping seeding.");
      return;
    }
    const hashedPassword = await bcrypt.hash("password123", 10);
    await User.create({
      firstName: "John",
      lastName: "Doe",
      userName: "jdoe11",
      email: "superadmin@example.com",
      password: hashedPassword,
      role: "super-admin",
    });
    console.log("✅ User seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding user:", error);
  }
};
