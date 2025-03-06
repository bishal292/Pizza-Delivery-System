import { Pizza } from "../../db/models/PizzaModels.js";
import { Cart } from "../../db/models/CartModel.js";
import { User } from "../../db/models/UserModel.js";
import { Inventory } from "../../db/models/InventoryModel.js";


export const getPizzas = async (req, res, next) => {
  try {
    const pizzas = await Pizza.find().sort({ updatedAt: -1 }).populate("base sauce cheese toppings", "name price");
    if (!pizzas) {
      return res.status(404).send("No Pizzas found");
    }
    res.status(200).send(pizzas);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

/**
  ----------------------------------------------------------------------------------------
  ---------------------------------- Cart Management ----------------------------------
  ----------------------------------------------------------------------------------------
  */

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const { pizzaId } = req.body;
    const pizza = await Pizza.findById(pizzaId);
    if (!pizza) {
      return res.status(404).send("Pizza not found");
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    cart.items.push({ pizza: pizzaId, quantity: 1 });
    await cart.save();

    res.status(200).json({ message: "Pizza added to cart", cart });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const cart = await Cart.findOne({ userId }).populate("items.pizza");
    if (!cart) {
      return res.status(404).send("Cart not found");
    }
    res.status(200).json(cart);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { pizzaId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    cart.items = cart.items.filter((item) => item.pizza.toString() !== pizzaId);
    await cart.save();

    res.status(200).json({ message: "Pizza removed from cart", cart });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getOptions = async (req, res, next) => {
  try {
    const bases = await Inventory.find({ category: "base" });
    const sauces = await Inventory.find({ category: "sauce" });
    const cheeses = await Inventory.find({ category: "cheese" });
    const toppings = await Inventory.find({ category: "topping" });

    res.status(200).json({ bases, sauces, cheeses, toppings });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const placeOrder = async (req, res, next) => {
}

export const getOrders = async (req, res, next) => {
}
export const getOrder = async (req, res, next) => {
}