const bcrypt = require("bcrypt");
const { User } = require("../models/user.js");
const {
  validationMiddleware,
} = require("../middleware/validationMiddleware.js");
const { JWT_SECRET, userJwt } = require("../config/jwtConfig.js");
const jwt = require("jsonwebtoken");
const guard = require("../guard.js");
module.exports = (app) => {
  app.post("/signup", async (req, res) => {
    try {
      const { name, email, phone, password, address, image } = req.body;
      const validate = validationMiddleware.validate(req.body, {
        abortEarly: false,
      });
      if (validate.error) {
        const errors = validate.error.details.map((err) => err.message);
        return res.status(403).send(errors);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        address,
        image,
      });
      const savedUser = await user.save();
      res
        .status(201)
        .json({ message: "User successfully registered.", user: savedUser });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email is already registered." });
      }
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).send("inputs cant be empty");
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
    userObject.token = jwt.sign({ user: userObject._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.send(userObject.token);
    console.log(userObject);
  });
  app.get("/login", guard, (req, res) => {
    console.log("login");
    const user = userJwt(req, res);
    res.send(user);
  });
};
