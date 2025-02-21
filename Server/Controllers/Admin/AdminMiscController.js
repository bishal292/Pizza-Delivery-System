import { isValidObjectId } from "mongoose";
import { Admin } from "../../db/models/AdminModel.js";
import { Inventory } from "../../db/models/InventoryModel.js";

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

export const liveOrders = async (req, res, next) => {

};
export const updateOrderStatus = async (req, res, next) => {

};
export const CompletedOrders = async (req, res, next) => {

};
