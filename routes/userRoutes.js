const express = require("express");
const userRouter = express.Router();
const {
  authUser,
  sameId,
  adminOnly,
  sameIdOrAdmin,
} = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getSingleUserData,
  EditUserData,
  EditUserBusiness,
  deleteUser,
} = require("../controllers/userController");

userRouter.get("/users", authUser, adminOnly, getAllUsers);
userRouter.get("/users/:id", authUser, sameIdOrAdmin, getSingleUserData);
userRouter.put("/users/:id", authUser, sameId, EditUserData);
userRouter.patch("/users/:id", authUser, sameId, EditUserBusiness);
userRouter.delete("/users/:id", authUser, sameIdOrAdmin, deleteUser);
module.exports = userRouter;
