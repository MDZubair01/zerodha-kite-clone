const mongoose = require("mongoose");

const HoldingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  avg: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  net: {
    type: String,
    default: "+0.00%",
  },
  day: {
    type: String,
    default: "+0.00%",
  },
});

const HoldingsModel = mongoose.model("Holding", HoldingSchema);

module.exports = { HoldingsModel };