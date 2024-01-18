const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const env = require("dotenv").config();
const moment = require("moment");
const fs = require("fs");
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
app.use(userRouter);
app.use(authRouter);
app.get("/", (req, res) => {
  res.send("Test");
});

// Logger Tests
// app.use((req, res, next) => {
//   const fileName = `./Logs/log_${moment().format("Y_M_D")}.txt`;
//   let content = "";
//   content += `Method:${req.method}\n`;
//   content += `Route:${req.url}\n`;
//   content += `Time:${new Date().toISOString()}\n\n`;
//   fs.appendFile(fileName, content, (err) => {});
//   next();
// });
// app.use((req, res, next) => {
//   // Save the original res.status function
//   const originalSendStatus = res.sendStatus;

//   // Override res.status function
//   res.sendStatus = function (statusCode) {
//     // If status code is 400 or higher, log the request
//     if (statusCode >= 400) {
//       const fileName = `./logs/log_${moment().format("YYYY_MM_DD")}.txt`;
//       let content = `Date: ${new Date().toISOString()}\n`;
//       content += `Status Code: ${statusCode}\n`;
//       content += `Error Message: ${res.statusMessage}\n\n`;
//       fs.appendFileSync(fileName, content, (err) => {
//         if (err) {
//           console.error("Error writing to log file", err);
//         }
//       });
//     }

//     // Call the original sendStatus method
//     return originalSendStatus.apply(this, arguments);
//   };

//   next();
// });
