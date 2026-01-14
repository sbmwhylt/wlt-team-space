import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Setup email sender
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "info@whyleavetown.com",
      subject: subject,
      text: message,
      replyTo: email,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
