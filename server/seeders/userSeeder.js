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
    const hashedPassword = await bcrypt.hash("superadminpass123", 10);
    await User.create({
      firstName: "Shemrei",
      lastName: "Marabillo",
      userName: "smarabillo",
      gender: "male",
      birthDate: "09-13-2002",
      email: "shemrei@whyleavetown.com",
      password: hashedPassword,
      role: "super-admin",
      status: "active",
      avatar: "https://i.pinimg.com/1200x/21/f4/65/21f465e19888e48a60b84804bcdf142d.jpg"
    });
    console.log("✅ User seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding user:", error);
  }
};
