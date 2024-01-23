const express = require("express");
const userRouter = express.Router();
const { adminOnly, authUser } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getSingleUserData,
  GetUserData,
  EditUserData,
  EditUserBusiness,
  deleteUser,
} = require("../controllers/userController");
userRouter.get("/users", authUser, adminOnly, getAllUsers);
userRouter.get("/users/:id", authUser, GetUserData, getSingleUserData);
userRouter.put("/users/:id", authUser, EditUserData);
userRouter.patch("/users/:id", authUser, EditUserBusiness);
userRouter.delete("/users/:id", authUser, deleteUser);
module.exports = userRouter;
