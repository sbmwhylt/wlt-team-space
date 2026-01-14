import express from "express";
import nodemailer from "nodemailer";
import { contactUpdateTemplate } from "../utils/emailTemplates.js";

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, formData } = req.body;

    // Generate HTML based on form type or subject
    const htmlContent = contactUpdateTemplate(formData);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: "info@whyleavetown.com",
      subject: subject,
      html: htmlContent,
      replyTo: email,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
