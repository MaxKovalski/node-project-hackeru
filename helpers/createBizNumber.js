const { Card } = require("../models/cards.js");
exports.createBizNumber = async () => {
  try {
    const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const card = await Card.findOne(
      { bizNumber: random },
      { bizNumber: 1, _id: 0 }
    );
    if (card) return createBizNumber();
    return random;
  } catch (error) {
    res.status(424).json({ error: "Cant Create Biz Number" });
  }
};
