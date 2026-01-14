import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import db from "./models/index.js";
import routes from "./routes/index.js";
import contactRouter from "./routes/contact.js";

dotenv.config();

const app = express();

// ------------------------ Middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(contactRouter);

// ------------------------ Root route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ------------------------ All Routes
app.use("/api/", routes);

// ------------------------ DB connection
db.sequelize
  .sync()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
