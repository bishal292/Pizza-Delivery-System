import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, enum: ['Regular', 'Medium', 'Large'], required: true },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  sauce: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  cheese: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  toppings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }],
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

export const Pizza = mongoose.model("Pizza", pizzaSchema);
