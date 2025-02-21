import mongoose from 'mongoose';
import { Pizza } from './PizzaModels.js';

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['cheese', 'sauce', 'base', 'topping'],
    required: true
  },
  type: {
    type: String,
    enum: ['veg', 'non-veg'],
    required: true
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  threshold: { type: Number, required: true },
  status: { type: String, enum: ['available', 'out of stock'], default: 'available' },
}, { timestamps: true });

// Whenever the stock is updated, the status will be updated as well
inventorySchema.pre('save', function(next) {
  this.status = this.stock == 0 ? 'out of stock' : 'available';
  next();
});

// Post-save hook to update the status of pizzas when an inventory item goes out of stock
inventorySchema.post('save', async function(doc, next) {
  // If the item goes out of stock, set the status of all pizzas using this item to 'unavailable'
  if (doc.status === 'out of stock') {
    try {
      await Pizza.updateMany(
        { $or: [{ base: doc._id }, { sauce: doc._id }, { cheese: doc._id }, { toppings: doc._id }] },
        { status: 'unavailable' }
      );
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export const Inventory = mongoose.model("Inventory", inventorySchema);