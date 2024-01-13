const bcrypt = require("bcrypt");
const { User } = require("../models/user.js");
const {
  validationMiddleware,
} = require("../middleware/validationMiddleware.js");
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
      // Handle errors, for example, duplicate email
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email is already registered." });
      }
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
