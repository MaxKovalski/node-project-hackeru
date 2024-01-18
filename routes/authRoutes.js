const express = require("express");
const authRouter = express.Router();
const { hello, login, signup } = require("../controllers/authController");
authRouter.get("/", hello);
authRouter.post("/signup", signup);
authRouter.post("/login", login);
module.exports = authRouter;
