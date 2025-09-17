import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;

    // Setup mail transporter (use real creds or service like SendGrid)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "neethavgeorge@gmail.com", pass: "ibzcrqqbdeqmovlu" }
    });

    const message = `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    `;

    transporter.sendMail(
  {
    from: "neethavgeorge@gmail.com",      // ✅ must match auth.user
    to: user.email,
    subject: "Test Nodemailer",
    text: "This is working with Gmail App Password!",
    html: message,                       // ✅ include html
  },
  (err, info) => {
    if (err) {
      console.error("Email send error:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  }
);

    res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    res.status(500).json({ message: "Forgot password failed", error: err.message });
  }
};
