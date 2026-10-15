const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  lastLogin: { type: Date },
  lastLogout: { type: Date },
  funds: {
    availableCash: { type: Number, default: 100000 },
    usedMargin: { type: Number, default: 0 },
  },
  apiKey: { type: String, default: null },
  apiSecret: { type: String, default: null },
  createdAt: { type: Date, default: () => new Date() },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };