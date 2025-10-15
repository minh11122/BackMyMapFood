const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",        // cố định Gmail
    port: 587,                     // dùng TLS
    secure: false,                 // 465 thì true, 587 thì false
    auth: {
      user: "lem29140@gmail.com",  // Gmail của bạn
      pass: "rneywpunfbluvgux",    // App Password (không phải mật khẩu Gmail)
    },
  });

  const mailOptions = {
    from: `"Hệ thống MyMapFood" <lem29140@gmail.com>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return { success: true, info };
  } catch (error) {
    console.error("❌ Send mail failed:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendMail };
