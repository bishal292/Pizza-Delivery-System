import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
    customizations: {
      extraCheese: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
      extraToppings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }]
    },
    quantity: { type: Number, required: true, default: 1 }
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['preparing', 'out for delivery', 'delivered'], default: 'preparing' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
