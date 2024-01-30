const jwt = require("jsonwebtoken");
const { JWT_SECRET, userJwt } = require("../config/jwtConfig");
exports.authUser = (req, res, next) => {
  jwt.verify(req.headers.authorization, JWT_SECRET, (err, data) => {
    if (err) {
      res.status(401).send("User Not Authorized");
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
exports.businessOnly = (req, res, next) => {
  if (!userJwt(req, res).IsBusiness) {
    return res.status(403).send("Access denied. Business only.");
  }
  next();
};
exports.sameIdOrAdmin = (req, res, next) => {
  const { userId, isAdmin } = userJwt(req, res);
  const { id } = req.params;
  if (id != userId && !isAdmin) {
    return res.status(401).send("User Not Authorized");
  }
  next();
};
