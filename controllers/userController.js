const { User } = require("../models/user.js");
const { userJwt } = require("../config/jwtConfig");
const { editUserValidator } = require("../middleware/validationMiddleware.js");
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.getSingleUserData = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send("User Not Found");
  }
};
exports.GetUserData = (req, res, next) => {
  const { userId, isAdmin } = userJwt(req, res);
  const { id } = req.params;
  if (id != userId && !isAdmin) {
    return res.status(401).send("User Not Authorized");
  }
  next();
};
exports.EditUserData = async (req, res) => {
  const { userId } = userJwt(req, res);
  const { id } = req.params;
  const updateData = req.body;
  try {
    if (id != userId) {
      return res.status(401).send("User Not Found");
    }
    const validate = editUserValidator.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (validate.error) {
      const errors = validate.error.details.map((err) => err.message);
      return res.status(403).send(errors);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User Not Found");
    }
    const userObject = updatedUser.toObject();
    delete userObject.password;
    res
      .status(200)
      .json({ message: "User Data Updated Successfully", user: userObject });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "User Not Found" });
  }
};
exports.EditUserBusiness = async (req, res, next) => {
  const { userId } = userJwt(req, res);
  const { id } = req.params;
  try {
    if (id != userId) {
      return res.status(401).send("User Not Found");
    }
    const userObject = await User.findById(userId);
    userObject.IsBusiness = !userObject.IsBusiness;
    await userObject.save();
    res.status(200).json({ message: "User Business Status Toggled" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "User Not Found" });
  }
};
exports.deleteUser = async (req, res) => {
  const { userId } = userJwt(req, res);
  const { id } = req.params;
  try {
    if (id != userId) {
      return res.status(404).send("User Not Found");
    }
    const userObject = await User.findByIdAndDelete(userId);
    if (!userObject) {
      return res.status(404).send("User Not Found");
    }
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    res.status(404).json({ error: "User Not Found" });
  }
};
