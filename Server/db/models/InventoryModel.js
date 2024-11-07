const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  baseSize: {
    Regular: {
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      threshold: { type: Number, required: true }
    },
    Medium: {
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      threshold: { type: Number, required: true }
    },
    Large: {
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      threshold: { type: Number, required: true }
    },
    Monster: {
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      threshold: { type: Number, required: true }
    }
  },
  baseType: {
    type: Map,
    of: {
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      threshold: { type: Number, required: true }
    }
  },
  sauce: {
    type: Map,
    of: {
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      threshold: { type: Number, required: true }
    }
  },
  cheese: {
    type: Map,
    of: {
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      threshold: { type: Number, required: true }
    }
  },
  toppings: {
    veggie: {
      type: Map,
      of: {
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        threshold: { type: Number, required: true }
      }
    },
    nonVeg: {
      type: Map,
      of: {
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        threshold: { type: Number, required: true }
      }
    }
  },
  createdAt: { type: Date, default: Date.now }
});


export const Inventory = mongoose.model("Inventory", inventorySchema);