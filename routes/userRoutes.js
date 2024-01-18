const express = require("express");
const userRouter = express.Router();
const { hello, login, signup } = require("../controllers/authController");
const { adminOnly, authUser } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getSingleUserData,
  GetUserData,
  EditUserData,
  EditUserBusiness,
  deleteUser,
} = require("../controllers/userController");
userRouter.get("/", hello);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/login", authUser, login);
userRouter.get("/users", authUser, adminOnly, getAllUsers);
userRouter.get("/users/:id", authUser, GetUserData, getSingleUserData);
userRouter.put("/users/:id", authUser, EditUserData);
userRouter.patch("/users/:id", authUser, EditUserBusiness);
userRouter.delete("/users/:id", authUser, deleteUser);
module.exports = userRouter;
