import mongoose from 'mongoose';
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

export const Inventory = mongoose.model("Inventory", inventorySchema);