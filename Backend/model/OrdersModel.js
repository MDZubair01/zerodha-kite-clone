// backend/model/OrdersModel.js
const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  mode: { type: String, required: true }, // BUY or SELL
  createdAt: { type: Date, default: Date.now },
});

const OrdersModel = mongoose.model("Order", OrdersSchema);
module.exports = { OrdersModel };