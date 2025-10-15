const nodemailer = require("nodemailer");

// Cấu hình SMTP Brevo
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // false vì port 587
  auth: {
    user: "995f9b001@smtp-brevo.com", // login SMTP Brevo
    pass: "8YSnFhkwyx7fR2bN",       // mật khẩu chính SMTP
  },
});

// Hàm gửi mail
const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Hệ thống của chúng tôi" <995f9b001@smtp-brevo.com>',
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ Send mail failed:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendMail };
