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

app.listen(env.parsed.PORT, async () => {
  console.log(`Listen to port: ${env.parsed.PORT}`);
  try {
    await mongoConnect();
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
});

app.get("/", (req, res) => {
  res.send("Test");
});
require("./controllers/authController")(app);
// require("./controllers/userController")(app);
