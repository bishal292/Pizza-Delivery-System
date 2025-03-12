import { Pizza } from "../../db/models/PizzaModels.js";
import { Cart } from "../../db/models/CartModel.js";
import { User } from "../../db/models/UserModel.js";
import { Inventory } from "../../db/models/InventoryModel.js";
import { isValidObjectId } from "mongoose";
import { calculatePrice } from "../../utils/util-functions.js";

export const getPizzas = async (req, res, next) => {
  try {
    const pizzas = await Pizza.find()
      .sort({ updatedAt: -1 })
      .populate("base sauce cheese toppings", "name price");
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
    if (!item) {
      return res.status(400).send("Item is required");
    }

    const { pizzaId, customizations = {} } = item;
    if (!pizzaId || !isValidObjectId(pizzaId)) {
      return res.status(400).send("Pizza ID is required and must be valid");
    }

    const pizza = await Pizza.findById(pizzaId).populate("base", "price");
    if (!pizza) {
      return res.status(404).send("Pizza not found");
    }

    // Ensure customizations object has required structure
    customizations.sauce = customizations.sauce || [];
    customizations.cheese = customizations.cheese || [];
    customizations.toppings = customizations.toppings || [];
    
    // Sort customizations arrays
    customizations.sauce.sort();
    customizations.cheese.sort();
    customizations.toppings.sort();

    // Remove base from customizations if it matches the default pizza base
    if (
      customizations.base &&
      customizations.base === pizza.base._id.toString()
    ) {
      delete customizations.base;
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the item already exists in the cart with the same customizations
    const existingItem = cart.items.find(
      (cartItem) =>
        cartItem.pizza.toString() === pizzaId && JSON.stringify(cartItem.customizations) ===
      JSON.stringify(customizations)

    );

    if (existingItem) {
      if (existingItem.quantity < 10) {
        existingItem.quantity += 1;
        existingItem.finalPrice += existingItem.price;
        await cart.save();
        return res.status(201).send("Quantity updated in cart");
      } else {
        return res.status(400).send("Maximum quantity reached");
      }
    }
    if (cart.items.length >= 10) {
      return res.status(400).send("Maximum 10 items allowed in cart");
    }
    // Calculate price based on base pizza and customizations
    const price = await calculatePrice(pizza, customizations);

    cart.items.push({ pizza: pizzaId, quantity: 1, customizations, price });
    await cart.save();

    res.status(201).send("Pizza added to cart");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}
// Helper function to compare arrays regardless of order


export const getCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch cart and populate pizza details along with customizations
    const cart = await Cart.findOne({ user: userId }).populate("items.pizza");

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", items: [] });
    }

    // Collect all customization IDs in a single query
    const baseIds = [];
    const sauceIds = [];
    const cheeseIds = [];
    const toppingIds = [];

    cart.items.forEach((item) => {
      if (item.customizations.base) baseIds.push(item.customizations.base);
      if (item.customizations.sauce)
        sauceIds.push(...item.customizations.sauce);
      if (item.customizations.cheese)
        cheeseIds.push(...item.customizations.cheese);
      if (item.customizations.toppings)
        toppingIds.push(...item.customizations.toppings);
    });

    // Fetch all inventory items at once to reduce DB queries
    const [baseMap, sauceMap, cheeseMap, toppingMap] = await Promise.all([
      Inventory.find({ _id: { $in: baseIds } }, "name price").then((items) =>
        items.reduce((acc, item) => ({ ...acc, [item._id]: item }), {})
      ),
      Inventory.find({ _id: { $in: sauceIds } }, "name").then((items) =>
        items.reduce((acc, item) => ({ ...acc, [item._id]: item.name }), {})
      ),
      Inventory.find({ _id: { $in: cheeseIds } }, "name").then((items) =>
        items.reduce((acc, item) => ({ ...acc, [item._id]: item.name }), {})
      ),
      Inventory.find({ _id: { $in: toppingIds } }, "name").then((items) =>
        items.reduce((acc, item) => ({ ...acc, [item._id]: item.name }), {})
      ),
    ]);

    // Process cart items
    const formattedItems = cart.items.map((item) => ({
      pizza: item.pizza,
      quantity: item.quantity,
      price: item.price,
      finalPrice: item.finalPrice,
      customizations: {
        base: item.customizations.base
          ? baseMap[item.customizations.base]
          : null,
        sauce:
          item.customizations.sauce
            ?.map((id) => sauceMap[id])
            .filter(Boolean) || [],
        cheese:
          item.customizations.cheese
            ?.map((id) => cheeseMap[id])
            .filter(Boolean) || [],
        toppings:
          item.customizations.toppings
            ?.map((id) => toppingMap[id])
            .filter(Boolean) || [],
      },
    }));

    res.status(200).json({
      _id: cart.__id,
      user: cart.user,
      items: formattedItems,
      totalPrice: cart.totalPrice,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id:pizzaId, idx:index, csm:customizations } = req.query;
    console.log(pizzaId, index, customizations);

    const cart = await Cart.findOne({ user:userId });
    if (!cart) {
      return res.status(404).send("Cart not found");
    }
    if (!pizzaId || !isValidObjectId(pizzaId)) {
      return res.status(400).send("Pizza ID is required and must be valid");
    }

    if (!index && !customizations) {
      res
        .status(400)
        .send("Index or customizations are required to remove item from cart");
    }
    if (index) {
      if (index < 0 || index >= cart.items.length) {
        return res.status(400).send("Invalid index");
      }
      if (cart.items[index].pizza._id.toString() === pizzaId) {
        cart.items.splice(index, 1);
        await cart.save();
        return res.status(200).send("Pizza removed from cart");
      } else {
        return res.status(400).send("NO item found at given index");
      }
    }

    const removed = cart.items.remove({
      pizza: pizzaId,
      customizations,
    });
    if (removed) {
      await cart.save();
      return res.status(200).send("Pizza removed from cart");
    } else {
      return res.status(404).send("Item not found in cart");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });
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
    const bases = await Inventory.find({ category: "base" ,status:"available" }, "name price");
    const sauces = await Inventory.find({ category: "sauce" ,status:"available" }, "name price");
    const cheeses = await Inventory.find({ category: "cheese" ,status:"available" }, "name price");
    const toppings = await Inventory.find({ category: "topping" ,status:"available" }, "name price");

    res.status(200).json({ bases, sauces, cheeses, toppings });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const placeOrder = async (req, res, next) => {};

export const getOrders = async (req, res, next) => {};
export const getOrder = async (req, res, next) => {};
