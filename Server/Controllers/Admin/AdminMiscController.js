import { isValidObjectId } from "mongoose";
import { Admin } from "../../db/models/AdminModel.js";
import { Inventory } from "../../db/models/InventoryModel.js";
import { Pizza } from "../../db/models/PizzaModels.js";
import multer from "multer";
import fs from 'fs';


export const dashboard = async (req, res, next) => {
    try {
        // Todo 
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");        
    }
};
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
        const { name, category, type, price, stock, threshold} = req.body;
        if (!name || !category || !type || !price || !stock || !threshold ) {
            return res.status(400).send("Please fill all fields");
        }
        const product = await Inventory.findOne({
            name
        });
        if (product) {
            return res.status(400).send("Product already exists, try updating it");
        }
        if(!['cheese', 'sauce', 'base', 'topping'].includes(category)){
            return res.status(400).send("Invalid Category");
        }
        if(!['veg', 'non-veg'].includes(type)){
            return res.status(400).send("Invalid Type");
        }

        const newProduct = new Inventory({
            name,
            category,
            type,
            price,
            stock,
            threshold
        });
        const savedProduct = await newProduct.save();
        if (!savedProduct) {
            return res.status(500).send("Error saving product");
        }
        res.status(201).json({message:"Product added successfully", product:savedProduct});
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
        const { name, type, price, stock, threshold,category } = req.body;
        if((category && product.category != category)|| (name && product.name != name)){
            return res.status(400).send("Name And Category cannot be updated");
        }
        if (!type && !price && !stock && !threshold) {
            return res.status(400).send("Some fields are required to update among type, price, stock, threshold.");
        }

        if (type && !['veg', 'non-veg'].includes(type)) {
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

        const updatedProduct = await Inventory.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!updatedProduct) {
            return res.status(500).send("Error updating product");
        }
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
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
        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }

}
export const getPizzas = async (req, res, next) => {
    try {
        const userId = req.userId;
        const admin = await Admin.findById(userId);
        if (!admin) return res.status(404).send("No Such Admin Found");

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

const storage = multer.diskStorage({
    destination: function (_, __, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (_, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({ storage: storage });
export const imageUpload = async (req, res, next) => {
    try {
        const userId = req.userId;
        const admin = await Admin.findById(userId);
        if (!admin) return res.status(404).send("Your Admin Account is not found");
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }
        res.status(200).json({ message: "Image uploaded successfully", imageUrl: req.file.filename });
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
        const { name, image, description, size, base, sauce, cheese, toppings, price } = req.body;
        
        if (!name || !image || !description || !size || !base || !price) {
            return res.status(400).send("Please fill all required fields : name, image, description, size, base, price");
        }
        if (!['Regular', 'Medium', 'Large', 'Monster'].includes(size)) {
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

        if (!(await validateInventoryItems([base], 'base'))) {
            return res.status(400).send("Invalid Base");
        }
        if (sauce && !(await validateInventoryItems(sauce, 'sauce'))) {
            return res.status(400).send("Invalid Sauce");
        }
        if (cheese && !(await validateInventoryItems(cheese, 'cheese'))) {
            return res.status(400).send("Invalid Cheese");
        }
        if (toppings && !(await validateInventoryItems(toppings, 'topping'))) {
            return res.status(400).send("Invalid Toppings");
        }

        // Check if pizza with same name and identical base already exists
        const existingPizza = await Pizza.findOne({ name, size, base});

        if (existingPizza) {
            return res.status(400).send("Pizza with the same name and base already exists try updating it");
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
            price
        });
        const savedPizza = await newPizza.save();
        if (!savedPizza) {
            return res.status(500).send("Error saving pizza");
        }
        res.status(201).json({message:"Pizza added successfully", pizza:savedPizza});
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

export const updatePizza = async (req, res, next) => {
    try{
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

        const { name, size, base, sauce, cheese, toppings, price, image, description } = req.body;

        if (!name && !base && !size && !price && !image && !description && !sauce && !cheese && !toppings) {
            return res.status(400).send("Some changes in any fields are required to perform updation");
        }

        if (size && !['Regular', 'Medium', 'Large', 'Monster'].includes(size)) {
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

        if (base && !(await validateInventoryItems([base], 'base'))) {
            return res.status(400).send("Invalid Base");
        }
        if (sauce && !(await validateInventoryItems(sauce, 'sauce'))) {
            return res.status(400).send("Invalid Sauce");
        }
        if (cheese && !(await validateInventoryItems(cheese, 'cheese'))) {
            return res.status(400).send("Invalid Cheese");
        }
        if (toppings && !(await validateInventoryItems(toppings, 'topping'))) {
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

        const updatedPizza = await Pizza.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!updatedPizza) {
            return res.status(500).send("Error updating pizza");
        }
        res.status(200).json({ message: "Pizza updated successfully", pizza: updatedPizza });

    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

export const deletePizza = async (req, res, next) => {
    try{
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
        res.status(200).json({ message: "Pizza deleted successfully", pizza: deletedPizza });
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

export const liveOrders = async (req, res, next) => {

};

export const updateOrderStatus = async (req, res, next) => {

};
export const CompletedOrders = async (req, res, next) => {

};
