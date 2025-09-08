import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./models/index.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);

// DB connection
db.sequelize
  .sync()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
