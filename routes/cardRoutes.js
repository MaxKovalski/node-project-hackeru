const express = require("express");
const {
  authUser,
  adminOnly,
  businessOnly,
  sameIdOrAdmin,
} = require("../middleware/authMiddleware");
const {
  createCard,
  getAllCards,
  getBusinessUserCard,
  getSingleCardData,
  EditCardData,
  likeCard,
  deleteCard,
  updateBizNumber,
} = require("../controllers/cardController");
const cardRouter = express.Router();
cardRouter.get("/cards", getAllCards);
cardRouter.get("/cards/my-cards", getBusinessUserCard);
cardRouter.get("/cards/:id", getSingleCardData);
cardRouter.post("/cards", authUser, businessOnly, createCard);
cardRouter.put("/cards/:id", authUser, EditCardData);
cardRouter.patch("/cards/:id", authUser, likeCard);
cardRouter.delete("/cards/:id", authUser, sameIdOrAdmin, deleteCard);
cardRouter.patch("/cards/biz-number/:id", adminOnly, updateBizNumber);
module.exports = cardRouter;
