const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const env = require("dotenv").config();
const moment = require("moment");
const fs = require("fs");
const morgan = require("morgan");
const chalk = require("chalk");
const cardRouter = require("./routes/cardRoutes");
const createInitialData = require("./helpers/createInitialData");
async function mongoConnect() {
  try {
    await mongoose.connect(env.parsed.MONGO_URL);
    console.log(chalk.bgGreen("MongoDB Connected"));
    createInitialData();
  } catch (err) {
    console.error(chalk.bgRed("Failed to connect to MongoDB"));
  }
}

mongoConnect().catch((err) => console.log(err));
const app = express();
morgan.token("time", () => moment().format("YYYY-MM-DD HH:mm:ss"));
const morganFormat = ":time :method :url :status :response-time ms";
app.use(morgan(morganFormat));
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
  console.log(chalk.bgMagenta(`Listen to port: ${env.parsed.PORT}`));
});
app.use(userRouter);
app.use(authRouter);
app.use(cardRouter);

app.use(express.static("public"));
app.use((req, res, next) => {
  res.status(404).send("Sorry, page not found");
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
