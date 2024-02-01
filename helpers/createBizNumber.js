const { Card } = require("../models/cards.js");
exports.createBizNumber = async () => {
  try {
    const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const card = await Card.findOne(
      { bizNumber: random },
      { bizNumber: 1, _id: 0 }
    );

    if (card) return createBizNumber();
    console.log(card);
    return random;
  } catch (error) {
    res.status(424).json({ error: "Cant Create Biz Number" });
  }
};
exports.isBizNumberExists = async (bizNumber) => {
  if (typeof bizNumber !== "number") {
    throw new Error("bizNumber must be a number");
  }
  const card = await Card.findOne({ bizNumber }, { bizNumber: 1, _id: 0 });
  return card;
};
