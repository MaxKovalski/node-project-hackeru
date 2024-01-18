const jwt = require("jsonwebtoken");
const { JWT_SECRET, userJwt } = require("../config/jwtConfig");
exports.authUser = (req, res, next) => {
  jwt.verify(req.headers.authorization, JWT_SECRET, (err, data) => {
    if (err) {
      res.status(401).send("user not authorized");
    } else {
      next();
    }
  });
};
exports.adminOnly = (req, res, next) => {
  if (!userJwt(req, res).isAdmin) {
    return res.status(403).send("Access denied. Admins only.");
  }
  next();
};
