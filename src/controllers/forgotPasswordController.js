import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = "XNYmyTM4nBZOb81K";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
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
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
//     });

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "9755d4001@smtp-brevo.com",
    pass: "XNYmyTM4nBZOb81K",
  },
});

      const mailOptions = {
    from: '"Support Desk" <9755d4001@smtp-brevo.com>', // must match Brevo sender
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <h3>Password Reset</h3>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <br/><br/>
      <p>If you did not request this, ignore this email.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset mail sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending mail:", error);
  }

    res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    res.status(500).json({ message: "Forgot password failed", error: err.message });
  }
};
