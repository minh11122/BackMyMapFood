const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./configs/db.connect");
const routes = require("./routes/index");


const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", routes);

connectDB();

app.get("/test-mail", async (req, res) => {
  const { sendMail } = require("./configs/mail.config"); // import Brevo SMTP

  const result = await sendMail({
    to: "your_email@gmail.com", // Thay bằng email của bạn
    subject: "Test gửi mail qua Brevo SMTP",
    html: "<h1>Xin chào từ MyMapFood!</h1><p>Mail này gửi qua Brevo SMTP ✅</p>",
  });

  res.json(result);
});




const PORT = process.env.PORT;
const HOST = process.env.HOSTNAME;
app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});