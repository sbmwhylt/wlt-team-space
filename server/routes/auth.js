import express from "express";
import { register, login } from "../controllers/authController.js";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ----------------------- Public
router.post("/register", register);
router.post("/login", login);

// ----------------------- Protected route (only logged-in users can access)
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ msg: "Profile data", user: req.user });
});

//----------------------- Role-based (only super-admin can access)
router.get("/admin", authMiddleware, authorizeRoles("super-admin"), (req, res) => {
  res.json({ msg: "Welcome Super Admin!" });
});

export default router;
