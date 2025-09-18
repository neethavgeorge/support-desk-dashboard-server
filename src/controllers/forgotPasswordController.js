import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import SibApiV3Sdk from "sib-api-v3-sdk";
import superagent from "superagent";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = "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";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `https://support-desk-dashboard-client.vercel.app/api/auth/reset-password/${resetToken}`;

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

      const sendEmail = async () => {
  try {
    const res = await superagent
      .post("https://api.sendinblue.com/v3/smtp/email")
      .set("api-key", "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") // Your API key
      .set("Content-Type", "application/json")
      .send({
        sender: { email: "sddashboard65@gmail.com", name: "Support Desk" },
        to: [{ email: user.email }],
        subject: "Password Reset",
        htmlContent: `<h3>Password Reset</h3>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <br/><br/>
      <p>If you did not request this, ignore this email.</p>`
      });

    console.log("✅ Email sent:", res.body);
  } catch (err) {
    console.error("❌ Error sending mail:", err.response?.text || err.message);
  }
};
sendEmail();
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
//   try {
//     const info = await transporter.sendMail(mailOptions);s
//     console.log("✅ Password reset mail sent:", info.messageId);
//     const result = await apiInstance.sendTransacEmail(email);
// console.log("Brevo response:", result);
//   } catch (error) {
//     console.error("❌ Error sending mail:", error);
//   }

    res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    res.status(500).json({ message: "Forgot password failed", error: err.message });
  }
};
