const axios = require("axios");

const BREVO_API_KEY = "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";

const sendMail = async ({ to, subject, html }) => {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "MyMapFood", email: "995f9b001@smtp-brevo.com" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Email sent via Brevo API", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("❌ Send mail via API failed", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendMail };
