import superagent from "superagent";

export const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    const response = await superagent
      .post("https://api.sendinblue.com/v3/smtp/email")
      .set("api-key", process.env.EMAIL_API_KEY)
      .set("Content-Type", "application/json")
      .send({
        sender: { email: "sddashboard65@gmail.com", name: "Support Desk" },
        to: [{ email: to }],
        subject,
        htmlContent,
      });

    console.log("✅ Email sent:", response.body);
    return true;
  } catch (err) {
    console.error("❌ Error sending mail:", err.response?.text || err.message);
    return false;
  }
};
