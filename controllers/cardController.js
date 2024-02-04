const { userJwt } = require("../config/jwtConfig.js");
const { Card } = require("../models/cards.js");
const { cardValidator } = require("../middleware/validationMiddleware.js");
const {
  createBizNumber,
  isBizNumberExists,
} = require("../helpers/createBizNumber.js");

exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
exports.getBusinessUserCard = async (req, res) => {
  try {
    const { userId } = userJwt(req, res);
    const cards = await Card.find({ user_id: userId });
    res.status(200).json(cards);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.getSingleCardData = async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id });
    res.status(200).send(card);
    console.log(card);
  } catch (error) {
    return res.status(404).json({ message: "Card Not Found" });
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
      const error = validate.error.details[0].message;
      return res.status(400).json({ message: error });
    }

    const card = new Card(cardData);

    const savedCard = await card.save();
    res
      .status(201)
      .json({ message: "Card successfully created.", user: savedCard });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
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
      const error = validate.error.details[0].message;
      return res.status(400).json({ message: error });
    }
    if (user_id != userId) {
      console.log(user_id);
      return res.status(404).json({ message: "Card Not Found1" });
    }
    const updatedCard = await Card.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedCard) {
      return res.status(404).json({ message: "Card Not Found" });
    }
    const cardObject = updatedCard.toObject();
    res
      .status(200)
      .json({ message: "Card Data Updated Successfully", card: cardObject });
  } catch (error) {
    return res.status(404).json({ message: "Card Not Found" });
  }
};

exports.likeCard = async (req, res) => {
  const { userId } = userJwt(req, res);
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card Not Found" });
    }
    const index = card.likes.indexOf(userId);
    let jsonMessage;
    if (index === -1) {
      card.likes.push(userId);
      jsonMessage = "Card Liked Successfully";
    } else {
      card.likes.splice(index, 1);
      jsonMessage = "Card Unliked Successfully";
    }
    await card.save();
    res.status(201).json({
      message: jsonMessage,
      likes: card.likes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const { userId, isAdmin } = userJwt(req, res);
    const { id } = req.params;
    const card = await Card.findById(id);
    if (card.user_id != userId && !isAdmin) {
      return res.status(404).json({ message: "Cannot Delete This Card" });
    }
    const deleteCard = await Card.findByIdAndDelete(id);
    if (!deleteCard) {
      return res.status(404).json({ message: "Card Not Found" });
    }
    res.status(200).json({ message: "Card Deleted Successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Card Not Found" });
  }
};

// **** bizNumber **** //
exports.updateBizNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { bizNumber } = req.body;
    const parsedBizNumber = parseInt(bizNumber, 10);
    if (isNaN(parsedBizNumber)) {
      return res
        .status(400)
        .json({ message: "BizNumber Must Be a Valid Number" });
    }
    const exists = await isBizNumberExists(parsedBizNumber);
    if (exists) {
      return res.status(406).json({ message: "bizNumber already exists" });
    }
    const updateCard = await Card.findByIdAndUpdate(
      id,
      { bizNumber: parsedBizNumber },
      { new: true }
    );
    if (!updateCard) {
      return res.status(404).json({ message: "Card Not Found" });
    }
    res
      .status(200)
      .json({ message: "bizNumber Successfully Updated", updateCard });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
