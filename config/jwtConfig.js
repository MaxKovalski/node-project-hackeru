const env = require("dotenv").config();
const jwt = require("jsonwebtoken");
exports.JWT_SECRET = env.parsed.JWT_SECRET;
exports.userJwt = (req, res) => {
  if (!req.headers.authorization) {
    return null;
  }
  const data = jwt.decode(req.headers.authorization, JWT_SECRET);
  if (!data) {
    res.status(401).send("User Not Authorized");
  }
  return data.user;
};
