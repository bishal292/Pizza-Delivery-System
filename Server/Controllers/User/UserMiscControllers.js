import { Pizza } from "../../db/models/PizzaModels.js";
import { Cart } from "../../db/models/CartModel.js";
import { User } from "../../db/models/UserModel.js";
import { Inventory } from "../../db/models/InventoryModel.js";
import { isValidObjectId } from "mongoose";


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
    const { item } = req.body;
    if(!item) {
      return res.status(400).send("Item is required");
    }
    const { pizzaId , customizations } = item;
    console.log("Pizza ID", pizzaId);

    if (!pizzaId || !isValidObjectId(pizzaId)) {
      return res.status(400).send("Pizza ID is required and must be a valid ID");
    }
    const pizza = await Pizza.findById(pizzaId).populate("base", "price");
    if (!pizza) {
      return res.status(404).send("Pizza not found");
    }
    
    let cart = await Cart.findOne({ user:userId });
    if (!cart) {
      cart = new Cart({ user:userId, items: [] });
    } else {
      if(!customizations.sauce) {
        customizations.sauce = [];
      }
      if(!customizations.cheese) {
        customizations.cheese = [];
      }
      if(!customizations.toppings) {
        customizations.toppings = [];
      }

      const existingItemIndex = cart.items.findIndex(
        (cartItem) => {
          console.log("Cart Item", JSON.stringify(cartItem.customizations));
          console.log("Customizations", JSON.stringify(customizations));
          return cartItem.pizza.toString() === pizzaId &&
                 JSON.stringify(cartItem.customizations) === JSON.stringify(customizations);
        }
      );
      if (existingItemIndex !== -1) {
        if (cart.items[existingItemIndex].quantity < 10) {
          cart.items[existingItemIndex].quantity += 1;
          await cart.save();
          return res.status(201).send("Quantity updated in cart");
        } else {
          return res.status(400).send("Maximum quantity reached");
        }
      }
    }

    // Calculate price based on pizza and customizations
    let price = pizza.price;
    if (customizations) {
      const { base, sauce, cheese, toppings } = customizations;
      if (base) {
        const baseItem = await Inventory.findById(base);
        if (baseItem) {
          price += (baseItem.price - pizza.base.price);
        }
      }
      if (sauce) {
        for (const sauceId of sauce) {
          const sauceItem = await Inventory.findById(sauceId);
          if (sauceItem) {
            price += sauceItem.price;
          }
        }
      }
      if (cheese) {
        for (const cheeseId of cheese) {
          const cheeseItem = await Inventory.findById(cheeseId);
          if (cheeseItem) {
            price += cheeseItem.price;
          }
        }
      }
      if (toppings) {
        for (const toppingId of toppings) {
          const toppingItem = await Inventory.findById(toppingId);
          if (toppingItem) {
            price += toppingItem.price;
          }
        }
      }
    }

    cart.items.push({ pizza: pizzaId, quantity: 1, customizations, price });
    await cart.save();

    res.status(201).send("Pizza added to cart");
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
    const cart = await Cart.findOne({ user:userId }).populate("items.pizza");
    if (!cart) {
      // return res.status(404).send("Cart is empty");
      return res.status(200).json({ message: "Cart is empty", cart: { items: [] } });
    }
    cart.items = await Promise.all(
      cart.items.map(async (item) => {
      const { pizza, customizations, quantity, price } = item;
      const populatedPizza = await Pizza.findById(pizza).populate("base sauce cheese toppings", "name price");
      populatedPizza.price = price * quantity;
      const customizationsArray = {};
      if (customizations.base) {
        const base = await Inventory.findById(customizations.base , "name");
        customizationsArray.base = base.name;
      }
      if (customizations.sauce) {
        const sauces = await Inventory.find({ _id: { $in: customizations.sauce } }, "name");
        customizationsArray.sauce = sauces.map((sauce) => sauce.name);
      }
      if (customizations.cheese) {
        const cheeses = await Inventory.find({ _id: { $in: customizations.cheese } }, "name");
        customizationsArray.cheese = cheeses.map((cheese) => cheese.name);
      }
      if (customizations.toppings) {
        const toppings = await Inventory.find({ _id: { $in: customizations.toppings } }, "name");
        customizationsArray.toppings = toppings.map((topping) => topping.name);
      }
      return { pizza: populatedPizza, customizations: customizationsArray, quantity };
      })
    );
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

    cart.items = cart.items.filter((item) => item.pizza._id.toString() !== pizzaId);
    await cart.save();

    cart.items = await Promise.all(
      cart.items.map(async (item) => {
      const { pizza, customizations, quantity, price } = item;
      const populatedPizza = await Pizza.findById(pizza).populate("base sauce cheese toppings", "name price");
      populatedPizza.price = price;
      return { pizza: populatedPizza, customizations, quantity };
      })
    );

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