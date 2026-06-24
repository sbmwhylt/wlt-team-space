import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import db from "./models/index.js";
import routes from "./routes/index.js";
import contactRouter from "./api/contactRouter.js";
import toolsRouter from "./api/toolsRouter.js";

const app = express();

// ------------------------ Middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// ------------------------ Root route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ------------------------ All Routes
app.use("/api/", routes);
app.use("/api/", contactRouter);
app.use("/api/", toolsRouter);

// ------------------------ DB connection
db.sequelize
  .sync()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
