const chalk = require("chalk");
const bcrypt = require("bcrypt");
const initialData = require("../data/initialData.json");
const { User } = require("../models/user");
const { Card } = require("../models/cards");
async function createInitialData() {
  try {
    const usersExist = await User.countDocuments();
    const cardsExist = await Card.countDocuments();
    if (!usersExist && !cardsExist) {
      let hashedUsers;
      try {
        hashedUsers = await Promise.all(
          initialData.initialUserData.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { ...user, password: hashedPassword };
          })
        );
      } catch (hashError) {
        console.error(chalk.bgRed("Error hashing user passwords:", hashError));
        return;
      }
      let insertedUsers = await User.insertMany(hashedUsers);
      console.log(chalk.bgYellow("Users Initial Data Inserted!"));
      let businessUserIds = insertedUsers
        .filter((user) => user.IsBusiness)
        .map((user) => user._id);
      let insertedCards = initialData.initialCardData.map((card) => {
        return {
          ...card,
          user_id:
            businessUserIds[Math.floor(Math.random() * businessUserIds.length)],
        };
      });
      await Card.insertMany(insertedCards);
      console.log(chalk.bgYellow("Cards Initial Data Inserted!"));
    }
  } catch (error) {
    console.error(chalk.bgRed("Initial Data Error:", error));
  }
}
module.exports = createInitialData;
