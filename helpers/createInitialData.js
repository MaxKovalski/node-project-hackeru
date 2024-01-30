const initialData = require("../data/initialData.json");
const { User } = require("../models/user");
const { Card } = require("../models/cards");
async function createInitialData() {
  try {
    // Connect to MongoDB
    // ...

    // Check if data already exists
    const usersExist = await User.countDocuments();
    const cardsExist = await Card.countDocuments();

    if (!usersExist && !cardsExist) {
      // Seed Users
      let insertedUsers = await User.insertMany(initialData.initialUserData);
      console.log("Users collection seeded!");

      // Filter users where IsBusiness is true and get their IDs
      let businessUserIds = insertedUsers
        .filter((user) => user.IsBusiness)
        .map((user) => user._id);

      // Prepare cards data with businessUserIds
      let cardsData = initialData.initialCardData.map((card) => {
        return {
          ...card,
          user_id:
            businessUserIds[Math.floor(Math.random() * businessUserIds.length)], // Assign a random business user ID
        };
      });

      // Seed Cards for business users
      await Card.insertMany(cardsData);
      console.log("Cards collection seeded!");
    }
  } catch (error) {
    console.error("Database seeding error:", error);
  }
}
module.exports = createInitialData;
