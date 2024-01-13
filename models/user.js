const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    first: { type: String },
    middle: { type: String },
    last: { type: String },
  },
  email: {
    type: String,
    unique: true,
  },
  phone: String,
  password: String,
  address: {
    state: { type: String },
    country: { type: String },
    city: { type: String },
    street: { type: String },
    houseNumber: { type: Number },
  },
  image: {
    url: { type: String },
    alt: { type: String },
  },
});
exports.User = mongoose.model("users", schema);
