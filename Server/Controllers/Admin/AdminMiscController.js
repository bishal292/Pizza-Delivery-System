import { isValidObjectId } from "mongoose";
import { Admin } from "../../db/models/AdminModel.js";
import { Inventory } from "../../db/models/InventoryModel.js";
import { Pizza } from "../../db/models/PizzaModels.js";
import { User } from "../../db/models/UserModel.js";
import { Cart } from "../../db/models/CartModel.js";
import { Order } from "../../db/models/Orders.js";
import { getFormattedCartItems } from "../../utils/util-functions.js";

export const dashboard = async (req, res, next) => {
  try {
    // Todo
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

/**
  ----------------------------------------------------------------------------------------
  ---------------------------------- Inventory Management ----------------------------------
  ----------------------------------------------------------------------------------------
  */

export const inventory = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("No Such Admin Found");
    const inventory = await Inventory.find().sort({ updatedAt: -1 });
    if (!inventory) {
      return res.status(404).send("Inventory is empty, add some products");
    }
    res.status(200).send(inventory);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("Your Admin Account is not found");
    const { name, category, type, price, stock, threshold } = req.body;
    if (!name || !category || !type || !price || !stock || !threshold) {
      return res.status(400).send("Please fill all fields");
    }
    const product = await Inventory.findOne({
      name,
    });
    if (product) {
      return res.status(400).send("Product already exists, try updating it");
    }
    if (!["cheese", "sauce", "base", "topping"].includes(category)) {
      return res.status(400).send("Invalid Category");
    }
    if (!["veg", "non-veg"].includes(type)) {
      return res.status(400).send("Invalid Type");
    }

    const newProduct = new Inventory({
      name,
      category,
      type,
      price,
      stock,
      threshold,
    });
    const savedProduct = await newProduct.save();
    if (!savedProduct) {
      return res.status(500).send("Error saving product");
    }
    res
      .status(201)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("Your Admin Account is not found");
    const { id } = req.query;
    if (!id || !isValidObjectId(id)) {
      return res.status(400).send("Invalid Product ID");
    }

    const product = await Inventory.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const { name, type, price, stock, threshold, category } = req.body;
    if (
      (category && product.category != category) ||
      (name && product.name != name)
    ) {
      return res.status(400).send("Name And Category cannot be updated");
    }
    if (!type && !price && !stock && !threshold) {
      return res
        .status(400)
        .send(
          "Some fields are required to update among type, price, stock, threshold."
        );
    }

    if (type && !["veg", "non-veg"].includes(type)) {
      return res.status(400).send("Invalid Type");
    }

    if (price && price < 7) {
      return res.status(400).send("Price cannot be less than 7.");
    }

    const updatedFields = {};
    if (type) updatedFields.type = type;
    if (price) updatedFields.price = price;
    if (stock) updatedFields.stock = stock;
    if (threshold) updatedFields.threshold = threshold;

    const updatedProduct = await Inventory.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(500).send("Error updating product");
    }
    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("Your Admin Account is not found");
    const { id } = req.query;
    if (!id || !isValidObjectId(id)) {
      return res.status(400).send("Invalid Product ID");
    }

    const product = await Inventory.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const deletedProduct = await Inventory.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(500).send("Error deleting product");
    }
    res
      .status(200)
      .json({
        message: "Product deleted successfully",
        product: deletedProduct,
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

/**
  ----------------------------------------------------------------------------------------
  ---------------------------------- Pizza Management ----------------------------------
  ----------------------------------------------------------------------------------------
  */

export const getPizzas = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("No Such Admin Found");

    // const pizzas = await Pizza.find()
    //   .select('_id name description image price size base')
    //   .populate('base','name').sort({ updatedAt: -1 });

    const pizzas = await Pizza.find().sort({ updatedAt: -1 });
    if (!pizzas) {
      return res.status(404).send("No Pizzas found");
    }
    res.status(200).send(pizzas);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getPizzaDetails = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.send("Your Admin account not found");
    const { id } = req.query;
    if (!id || !isValidObjectId(id)) {
      return res.status(400).send("Invalid Pizza ID");
    }

    const pizza = await Pizza.findById(id).populate(
      "base sauce cheese toppings","name"
    );
    if (!pizza) {
      return res.status(404).send("Pizza not found");
    }

    res.status(200).json(pizza);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const imageUpload = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("Your Admin Account is not found");
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    res
      .status(200)
      .json({
        message: "Image uploaded successfully",
        imageUrl: req.file.filename,
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
export const addPizza = async (req, res) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("Your Admin Account is not found");
    const {
      name,
      image,
      description,
      size,
      base,
      sauce,
      cheese,
      toppings,
      price,
    } = req.body;

    if (!name || !image || !description || !size || !base || !price) {
      return res
        .status(400)
        .send(
          "Please fill all required fields : name, image, description, size, base, price"
        );
    }
    if (!["Regular", "Medium", "Large", "Monster"].includes(size)) {
      return res.status(400).send("Invalid Size");
    }
    if (isNaN(price)) {
      return res.status(400).send("Price must be a number");
    }

    const validateInventoryItems = async (items, category) => {
      if (!Array.isArray(items)) return false;
      for (const item of items) {
        if (!isValidObjectId(item)) return false;
        const inventoryItem = await Inventory.findOne({ _id: item, category });
        if (!inventoryItem) return false;
      }
      return true;
    };

    if (!(await validateInventoryItems([base], "base"))) {
      return res.status(400).send("Invalid Base");
    }
    if (sauce && !(await validateInventoryItems(sauce, "sauce"))) {
      return res.status(400).send("Invalid Sauce");
    }
    if (cheese && !(await validateInventoryItems(cheese, "cheese"))) {
      return res.status(400).send("Invalid Cheese");
    }
    if (toppings && !(await validateInventoryItems(toppings, "topping"))) {
      return res.status(400).send("Invalid Toppings");
    }

    // Check if pizza with same name and identical base already exists
    const existingPizza = await Pizza.findOne({ name, size, base });

    if (existingPizza) {
      return res
        .status(400)
        .send(
          "Pizza with the same name and base already exists try updating it"
        );
    }

    const newPizza = new Pizza({
      name,
      image,
      description,
      size,
      base,
      sauce,
      cheese,
      toppings,
      price,
    });
    const savedPizza = await newPizza.save();
    if (!savedPizza) {
      return res.status(500).send("Error saving pizza");
    }
    res
      .status(201)
      .json({ message: "Pizza added successfully", pizza: savedPizza });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const updatePizza = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("Your Admin Account is not found");
    const { id } = req.query;
    if (!id || !isValidObjectId(id)) {
      return res.status(400).send("Invalid Pizza ID");
    }

    const pizza = await Pizza.findById(id);
    if (!pizza) {
      return res.status(404).send("Pizza not found");
    }

    const {
      name,
      size,
      base,
      sauce,
      cheese,
      toppings,
      price,
      image,
      description,
    } = req.body;

    if (
      !name &&
      !base &&
      !size &&
      !price &&
      !image &&
      !description &&
      !sauce &&
      !cheese &&
      !toppings
    ) {
      return res
        .status(400)
        .send("Some changes in any fields are required to perform updation");
    }

    if (size && !["Regular", "Medium", "Large", "Monster"].includes(size)) {
      return res.status(400).send("Invalid Size");
    }

    if (price && isNaN(price)) {
      return res.status(400).send("Price must be a number");
    }

    const validateInventoryItems = async (items, category) => {
      if (!Array.isArray(items)) return false;
      for (const item of items) {
        if (!isValidObjectId(item)) return false;
        const inventoryItem = await Inventory.findOne({ _id: item, category });
        if (!inventoryItem) return false;
      }
      return true;
    };

    if (base && !(await validateInventoryItems([base], "base"))) {
      return res.status(400).send("Invalid Base");
    }
    if (sauce && !(await validateInventoryItems(sauce, "sauce"))) {
      return res.status(400).send("Invalid Sauce");
    }
    if (cheese && !(await validateInventoryItems(cheese, "cheese"))) {
      return res.status(400).send("Invalid Cheese");
    }
    if (toppings && !(await validateInventoryItems(toppings, "topping"))) {
      return res.status(400).send("Invalid Toppings");
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (base) updatedFields.base = base;
    if (size) updatedFields.size = size;
    if (price) updatedFields.price = price;
    if (image) updatedFields.image = image;
    if (description) updatedFields.description = description;
    if (sauce) updatedFields.sauce = sauce;
    if (cheese) updatedFields.cheese = cheese;
    if (toppings) updatedFields.toppings = toppings;

    const updatedPizza = await Pizza.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedPizza) {
      return res.status(500).send("Error updating pizza");
    }
    res
      .status(200)
      .json({ message: "Pizza updated successfully", pizza: updatedPizza });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const deletePizza = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("Your Admin Account is not found");
    const { id } = req.query;
    if (!id || !isValidObjectId(id)) {
      return res.status(400).send("Invalid Pizza ID");
    }

    const pizza = await Pizza.findById(id);
    if (!pizza) {
      return res.status(404).send("Pizza not found");
    }
    const deletedPizza = await Pizza.findByIdAndDelete(id);
    if (!deletedPizza) {
      return res.status(500).send("Error deleting pizza");
    }
    res
      .status(200)
      .json({ message: "Pizza deleted successfully", pizza: deletedPizza });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

/**
  ----------------------------------------------------------------------------------------
  ---------------------------------- Orders Management ----------------------------------
  ----------------------------------------------------------------------------------------
 */

export const allOrders = async (req, res, next) => {};
export const liveOrders = async (req, res, next) => {};
export const updateOrderStatus = async (req, res, next) => {};
export const CompletedOrders = async (req, res, next) => {};
export const CancelledOrders = async (req, res, next) => {};
export const PendingOrders = async (req, res, next) => {};
export const OrderDetails = async (req, res, next) => {};

/**
  ----------------------------------------------------------------------------------------
  ---------------------------------- User Management ----------------------------------
  ----------------------------------------------------------------------------------------
 */

export const getAllUsers = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("No Such Admin Found");
    const users = await User.find().sort({ updatedAt: -1 });
    if (!users) {
      return res.status(404).send("No Users found");
    }

    const usersWithDetails = await Promise.all(users.map(async (user) => {
      const orders = await Order.find({ userId: user._id });
      const totalOrders = orders.length;
      const totalAmountSpent = orders.reduce((acc, order) => acc + order.totalPrice, 0);
      const cartItems = await Cart.find({ userId: user._id });
      const totalCartItems = cartItems.items.length;

      return {
        ...user.toObject(),
        totalOrders,
        totalAmountSpent,
        totalCartItems
      };
    }));

    res.status(200).send(usersWithDetails);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("Your Admin Account is not found");
    const { id } = req.query;
    if (!id || !isValidObjectId(id)) {
      return res.status(400).send("Invalid User ID");
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const { name, email ,password} = req.body;
    if (!name && !email && !password) {
      return res
        .status(400)
        .send("Some fields are required to update among name, email, password.");
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = password;

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields);
    if (!updatedUser) {
      return res.status(500).send("Error updating user");
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).send("Your Admin Account is not found");
    const { id } = req.query;
    if (!id || !isValidObjectId(id)) {
      return res.status(400).send("Invalid User ID");
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(500).send("Error deleting user");
    }
    res
      .status(200)
      .json({ message: "User deleted successfully"});
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
export const userOrders = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("No Such Admin Found");
    const {id} = req.query;
    if (!id || !isValidObjectId(id)) {
      return res.status(400).send("Invalid User ID");
    }
    const orders = await Order.find({
      userId: id
    }).sort({updatedAt:-1});
    if (!orders) {
      return res.status(404).send("No Orders found");
    }
    const formattedUserOrder = orders.map(async order => {
      const foramattedItem = await getFormattedCartItems({cart:order})
      return {
        orderId: order._id,
        items: foramattedItem,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt
      }
    });
    
    res.status(200).send(formattedUserOrder);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};