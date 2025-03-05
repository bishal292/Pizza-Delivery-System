import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
    customizations: {
      base: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
      sauce: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }],
      cheese: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }],
      toppings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }]
    },
    quantity: { type: Number, required: true, default: 1 }
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Placed','preparing', 'out for delivery', 'delivered'], default: 'Placed' },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
