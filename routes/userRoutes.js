const express = require("express");
const userRouter = express.Router();
const {
  adminOnly,
  authUser,
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
userRouter.put("/users/:id", authUser, EditUserData);
userRouter.patch("/users/:id", authUser, EditUserBusiness);
userRouter.delete("/users/:id", authUser, sameIdOrAdmin, deleteUser);
module.exports = userRouter;
