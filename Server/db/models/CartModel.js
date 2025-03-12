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
        ref: 'Pizza',
        required: true
      },
      quantity: { type: Number, required: true, min: 1 },
      customizations: {
        base: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
        sauce: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }],
        cheese: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }],
        toppings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }]
      },
      price: { type: Number, required: true }, // Price based on the pizza and customizations
      finalPrice: { 
        type: Number, 
        required: true, 
        default: function() { return this.price * this.quantity; } // Calculated price based on quantity
      }
    }
  ],
  totalPrice: { type: Number, required: true, default: 0 }, // Calculated total price
}, { timestamps: true});
// Middleware to auto-update the `updatedAt` field and total price of the cart.
cartSchema.pre('save', function (next) {
  this.items.forEach(item => {
    item.finalPrice = item.price * item.quantity;
  });
  this.totalPrice = this.items.reduce((sum, item) => sum + item.finalPrice, 0);
  next();
});

export const Cart = mongoose.model('Cart', cartSchema);
