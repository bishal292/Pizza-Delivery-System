import mongoose from "mongoose";

const defaultPizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  baseSize: {
    type: String,
    enum: ['Regular', 'Medium', 'Large'],
    required: true
  },
  baseType: {
    type: String,
    enum: [
      "thin crust",
      "hand tossed",
      "cheese Burst",
      "100% wheat thin crust",
      "New York Style crust",
    ],
    required: true,
  },
  sauce: {
    type: String,
    enum: [
      "classic Tomato Sauce",
      "Alfredo Sauce",
      "Pesto Sauce",
      "Barbecue Sauce",
      "Spicy Arrabbiata Sauce",
    ],
    required: true,
  },
  cheese: {
    type: String,
    enum: ["mozzarella", "cheddar", "parmesan", "Goat Cheese", "Blue cheese"],
    required: true,
  },
  veggies: {
    type: [String],
    enum: [
      "Paneer",
      "grilled Mushrooms",
      "Onion",
      "BlackOlive",
      "Jalpeno",
      "Red pepper",
      "Capsicum",
      "Fresh Tomato",
    ],
  },
  nonVegToppings: {
    type: [String],
    enum: [
      "Peri-peri Chicken",
      "Pepper Barbecue Chicken",
      "Chicken Pepperoni",
      "Chicken Tikka",
      "Chicken Sausage",
      "Grilled Chicken Rasher",
      "Chicken Keema",
    ],
  },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Custom Pizza Schema
const customPizzaSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Custom name for the pizza
  baseSize: {
    type: String,
    enum: ["Regular", "Medium", "Large", "Monster"], // Only these sizes are allowed
    required: true,
  },
  baseType: {
    type: String,
    required: true,
  },
  sauce: {
    type: String,
    required: true,
  },
  cheese: {
    type: String,
    required: true,
  },
  toppings: {
    veggie: { type: [String], default: [] }, // Array of veggie toppings
    nonVeg: { type: [String], default: [] }, // Array of non-veg toppings
  },
  price: { type: Number, required: true }, // Total calculated price of the custom pizza
  createdAt: { type: Date, default: Date.now },
});

export const defaultPizza = mongoose.model("DefaultPizza", defaultPizzaSchema);
