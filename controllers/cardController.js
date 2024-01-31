const { userJwt } = require("../config/jwtConfig.js");
const { Card } = require("../models/cards.js");
const { cardValidator } = require("../middleware/validationMiddleware.js");
const { createBizNumber } = require("../helpers/createBizNumber.js");
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.getBusinessUserCard = async (req, res) => {
  try {
    const { userId } = userJwt(req, res);
    const cards = await Card.find({ user_id: userId });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.getSingleCardData = async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id });
    res.status(200).send(card);
    console.log(card);
  } catch (error) {
    res.status(404).send("Card Not Found");
  }
};
exports.createCard = async (req, res) => {
  try {
    const userId = userJwt(req, res).userId;
    const cardData = req.body;
    cardData.user_id = userId;
    cardData.bizNumber = await createBizNumber();
    const validate = cardValidator.validate(cardData, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (validate.error) {
      const errors = validate.error.details.map((err) => err.message);
      return res.status(403).send(errors);
    }
    const card = new Card(cardData);

    const savedCard = await card.save();
    res
      .status(201)
      .json({ message: "Card successfully created.", user: savedCard });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.EditCardData = async (req, res) => {
  try {
    const { userId } = userJwt(req, res);
    const { id } = req.params;
    const { user_id } = req.body;
    const updateData = req.body;
    const validate = cardValidator.validate(updateData, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (validate.error) {
      const errors = validate.error.details.map((err) => err.message);
      return res.status(403).send(errors);
    }
    if (user_id != userId) {
      return res.status(404).send("Cards Not Found");
    }
    const updatedCard = await Card.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedCard) {
      return res.status(404).send("Card Not Found");
    }
    const cardObject = updatedCard.toObject();
    res
      .status(200)
      .json({ message: "Card Data Updated Successfully", card: cardObject });
  } catch (error) {
    res.status(404).json({ error: "Card Not Found" });
  }
};
exports.likeCard = async (req, res) => {
  const { userId } = userJwt(req, res);
  const card = await Card.findOneAndUpdate(
    { _id: req.params.id },
    { $addToSet: { likes: userId } },
    { new: true }
  );
  if (!card) {
    return res.status(404).send("Card Not Found");
  }
  res.status(200).json({ message: "Card liked successfully", card: card });
};
exports.deleteCard = async (req, res) => {
  try {
    const { userId, isAdmin } = userJwt(req, res);
    const { id } = req.params;
    const card = await Card.findById(id);
    if (card.user_id != userId && !isAdmin) {
      return res.status(404).send(" Cannot Delete This Card");
    }
    const deleteCard = await Card.findByIdAndDelete(id);
    if (!deleteCard) {
      return res.status(404).send("Card Not Found");
    }
    res.status(200).json({ message: "Card Deleted Successfully" });
  } catch (error) {
    res.status(404).json({ error: "Card Not Found" });
  }
};
// **** Bonus **** //
