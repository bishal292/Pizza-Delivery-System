import { Pizza } from "../../db/models/PizzaModels.js";
import { Cart } from "../../db/models/CartModel.js";
import { User } from "../../db/models/UserModel.js";
import { Inventory } from "../../db/models/InventoryModel.js";
import { isValidObjectId } from "mongoose";
import {
  calculatePrice,
  getFormattedCartItems,
} from "../../utils/util-functions.js";
import { instance } from "../../Services/RazorPay.js";
import { Order } from "../../db/models/Orders.js";

export const getPizzas = async (req, res, next) => {
  try {
    const pizzas = await Pizza.find({ status: "available" })
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
        cartItem.pizza.toString() === pizzaId &&
        JSON.stringify(cartItem.customizations) ===
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
};
// Helper function to compare arrays regardless of order

export const getCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch cart and populate pizza details along with customizations
    // const cart = await Cart.findOne({ user: userId })

    // if (!cart) {
    //   return res.status(200).json({ message: "Cart is empty", items: [] });
    // }

    // const formattedItems = await getFormattedCartItems({ cart });
    // res.status(200).json({
    //   _id: cart._id,
    //   user: cart.user,
    //   items: formattedItems,
    //   totalPrice: cart.totalPrice,
    //   createdAt: cart.createdAt,
    //   updatedAt: cart.updatedAt,
    // });

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.pizza",
        model: Pizza,
        populate: [
          { path: "base", model: Inventory, select: "name -_id" },
          { path: "sauce", model: Inventory, select: "name -_id" },
          { path: "cheese", model: Inventory, select: "name -_id" },
          { path: "toppings", model: Inventory, select: "name -_id" },
        ],
      })
      .populate({
        path: "items.customizations.base",
        model: Inventory,
        select: "name -_id",
      })
      .populate({
        path: "items.customizations.sauce",
        model: Inventory,
        select: "name -_id",
      })
      .populate({
        path: "items.customizations.cheese",
        model: Inventory,
        select: "name -_id",
      })
      .populate({
        path: "items.customizations.toppings",
        model: Inventory,
        select: "name -_id",
      });

    res.status(200).json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id: pizzaId, idx: index, csm: customizations } = req.query;
    console.log(pizzaId, index, customizations);

    const cart = await Cart.findOne({ user: userId });
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

    await Cart.findOneAndDelete({ user: userId });

    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getOptions = async (req, res, next) => {
  try {
    const bases = await Inventory.find(
      { category: "base", status: "available" },
      "name price"
    );
    const sauces = await Inventory.find(
      { category: "sauce", status: "available" },
      "name price"
    );
    const cheeses = await Inventory.find(
      { category: "cheese", status: "available" },
      "name price"
    );
    const toppings = await Inventory.find(
      { category: "topping", status: "available" },
      "name price"
    );

    res.status(200).json({ bases, sauces, cheeses, toppings });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

/**
  ----------------------------------------------------------------------------------------
  ---------------------------------- Order Management ----------------------------------
  ----------------------------------------------------------------------------------------
*/

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const tableNo = parseInt(req.body.tableNo);
    if (!tableNo) {
      return res.status(400).send("Table number is required");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length < 1) {
      return res.status(200).json({ message: "Cart is empty", items: [] });
    }

    const outOfStockItems = [];

    // Check stock for each item in the cart and store information.
    const stockCounter = {};

    for (const item of cart.items) {
      const qty = item.quantity;
    
      const pizza = await Pizza.findById(item.pizza).populate(
        "base",
        "name price stock status"
      );
    
      if (!pizza || pizza.status === "unavailable") {
        outOfStockItems.push({ name: pizza?.name || "Unknown Pizza", reason: "Pizza unavailable" });
        continue;
      }
    
      // ✅ Count base stock
      const baseId = item.customizations.base || pizza.base._id.toString();
      stockCounter[baseId] = (stockCounter[baseId] || 0) + qty;
    
      // ✅ Count sauce stock
      const allSauces = [...(pizza.sauce || []), ...(item.customizations.sauce || [])];
      for (const sauceId of allSauces) {
        stockCounter[sauceId] = (stockCounter[sauceId] || 0) + qty * 5;
      }
    
      // ✅ Count cheese stock
      const allCheeses = [...(pizza.cheese || []), ...(item.customizations.cheese || [])];
      for (const cheeseId of allCheeses) {
        stockCounter[cheeseId] = (stockCounter[cheeseId] || 0) + qty * 5;
      }
    
      // ✅ Count topping stock
      const allToppings = [...(pizza.toppings || []), ...(item.customizations.toppings || [])];
      for (const toppingId of allToppings) {
        stockCounter[toppingId] = (stockCounter[toppingId] || 0) + qty * 10;
      }
    }
    
    // ✅ Batch check inventory stock
    const ingredientIds = Object.keys(stockCounter);
    const inventoryItems = await Inventory.find({ _id: { $in: ingredientIds } });
    
    for (const ingredient of inventoryItems) {
      const totalRequired = stockCounter[ingredient._id.toString()];
      
      if (ingredient.stock < totalRequired) {
        outOfStockItems.push({
          name: ingredient.name,
          category: ingredient.category,
          reason: `Out of stock. Required: ${totalRequired}, Available: ${ingredient.stock}`,
        });
      }
    }

    if (outOfStockItems.length > 0) {
      return res
        .status(400)
        .json({
          message:
            "Some items are out of stock Please remove them or wait for item to be available in Stock.",
          outOfStockItems,
        });
    }
    const options = {
      amount: Number(cart?.totalPrice * 100) || 0,
      currency: "INR",
    };
    // const order_Razor = await instance.orders.create(options);
    // if (!order_Razor) {
    //   return res.status(500).send("Failed to create order Payment");
    // }

    const order = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      // orderId: order_Razor.id, // Replace with actual RazorPay order ID if needed
      orderId: "Demo_order-id", // Replace with actual RazorPay order ID if needed
      tableNo,
    });
    await order.save();

    if (!order) {
      return res.status(500).json({ message: "Failed to place order" });
    }

    // const isCartClear = await Cart.findOneAndDelete({ user: userId });
    // if (!isCartClear) {
    //   return res.status(500).send("Failed to clear cart but created Order");
    // }

    res.status(201).json({
      _id: order._id,
      message: "Order placed successfully",
      // order: order_Razor,
      order,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const orders = await Order.find({ userId })
      .populate("items.pizza")
      .sort({ updatedAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(204).send("No orders found");
    }

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      totalPrice: order.totalPrice,
      totalQuantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      image: order.items[0]?.pizza?.image || null,
      status: order.status,
      tableNo: order.tableNo,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    res.status(200).json(formattedOrders);
    res.status(200).send(orders);
  } catch (error) {}
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const { id: orderId } = req.query;

    if (!orderId || !isValidObjectId(orderId)) {
      return res.status(400).send("Valid order ID is required");
    }

    const order = await Order.findById(orderId).populate("items.pizza");
    if (!order) {
      return res.status(404).send("Order not found");
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).send("You are not authorized to view this order");
    }

    // Format the order items
    const formattedItems = await getFormattedCartItems({ cart: order });
    const formattedOrder = {
      _id: order._id,
      userId: order.userId,
      items: formattedItems,
      totalPrice: order.totalPrice,
      status: order.status,
      tableNo: order.tableNo,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    res.status(200).json(formattedOrder);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
