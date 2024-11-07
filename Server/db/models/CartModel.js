// models/Cart.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [
      {
        pizza: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'items.pizzaType', // Dynamically set the reference based on pizzaType
          required: true
        },
        pizzaType: {
          type: String,
          enum: ['DefaultPizza', 'CustomPizza'], // Determines which schema to reference
          required: true
        },
        quantity: { type: Number, required: true, min: 1 },
        customizations: {
          base: { type: String },
          sauce: { type: String },
          cheese: { type: String },
          veggies: { type: [String], default: [] },
          nonVegToppings: { type: [String], default: [] }
        },
        price: { type: Number, required: true } // Price based on the pizza and customizations
      }
    ],
    totalPrice: { type: Number, required: true, default: 0 }, // Calculated total price
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
// Middleware to auto-update the `updatedAt` field and total price of the cart.
cartSchema.pre('save', function (next) {
    this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.updatedAt = Date.now();
    next();
  });

export default mongoose.model('Cart', cartSchema);
