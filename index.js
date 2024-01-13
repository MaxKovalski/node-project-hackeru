const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv").config();
async function mongoConnect() {
  await mongoose.connect(env.parsed.MONGO_URL);
  console.log("monogodb Connected");
}
mongoConnect().catch((err) => console.log(err));
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET,PUT,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
  })
);
app.listen(env.parsed.PORT, () => {
  console.log(`Listen to port: ${env.parsed.PORT}`);
});
app.get("/", (req, res) => {
  res.send("Test");
});
require("./controllers/authController")(app);
