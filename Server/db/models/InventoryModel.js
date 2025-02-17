const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['cheese', 'sauce', 'base', 'topping'],
    required: true
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  threshold: { type: Number, required: true },
  status: { type: String, enum: ['available', 'out of stock'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Inventory = mongoose.model("Inventory", inventorySchema);