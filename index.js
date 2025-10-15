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
  const { sendMail } = require("./configs/mail.config");
  const result = await sendMail({
    to: "email_của_bạn@gmail.com",
    subject: "Test gửi mail Brevo HTTP",
    html: "<h1>Thử gửi mail thành công ✅</h1>",
  });
  res.json(result);
});



const PORT = process.env.PORT;
const HOST = process.env.HOSTNAME;
app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});