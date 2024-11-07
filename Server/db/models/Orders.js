import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  items: {
    type: Array,
    default: [],
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Placed",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
