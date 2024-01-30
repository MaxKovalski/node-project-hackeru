const bcrypt = require("bcrypt");
const { User } = require("../models/user.js");
const {
  newUserValidator,
  loginUserValidator,
} = require("../middleware/validationMiddleware.js");
const { JWT_SECRET } = require("../config/jwtConfig.js");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const userData = req.body;
    const validate = newUserValidator.validate(userData, {
      abortEarly: false,
    });
    if (validate.error) {
      const errors = validate.error.details.map((err) => err.message);
      return res.status(403).send(errors);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = new User(userData);
    const savedUser = await user.save();
    res
      .status(201)
      .json({ message: "User successfully registered.", user: savedUser });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email is already registered." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validate = loginUserValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validate.error) {
      const errors = validate.error.details.map((err) => err.message);
      return res.status(403).send(errors);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).send("email or password in incorrect");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("email or password in incorrect");
    }
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.email;
    userObject.token = jwt.sign(
      {
        userId: userObject._id,
        isAdmin: userObject.isAdmin,
        IsBusiness: userObject.IsBusiness,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.send(userObject.token);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
