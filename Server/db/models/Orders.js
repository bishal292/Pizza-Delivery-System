import mongoose from "mongoose";
import { Inventory } from "./InventoryModel.js";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        pizza: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pizza",
          required: true,
        },
        customizations: {
          base: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
          sauce: [{ type: mongoose.Schema.Types.ObjectId, ref: "Inventory" }],
          cheese: [{ type: mongoose.Schema.Types.ObjectId, ref: "Inventory" }],
          toppings: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
          ],
        },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }, // Price based on the pizza and customizations
        finalPrice: {
          type: Number,
          required: true,
          default: function () {
            return this.price * this.quantity;
          },
        },
      },
    ],
    totalPrice: { type: Number, required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String },
    status: {
      type: String,
      enum: ["pending", "placed", "preparing", "prepared", "delivered","cancelled"],
      default: "pending",
    },
    tableNo: { type: Number, required: true },
  },
  { timestamps: true }
);

orderSchema.post("save", async function (doc, next) {
  try { 
    
    const bulkOps = [];

    // Prepare batch stock reduction operations
    for (const item of doc.items) {
      const quantity = item.quantity;

      // Decrease stock for pizza ingredients
      const pizza = await mongoose.model("Pizza").findById(item.pizza)
        .populate("base sauce cheese toppings")
        .lean();

      const inventoryItems = [
        { id: item.customizations.base || pizza.base, decrement: 1 },
        ...(pizza.sauce || []).map((id) => ({ id, decrement: 5 })),
        ...(pizza.cheese || []).map((id) => ({ id, decrement: 5 })),
        ...(pizza.toppings || []).map((id) => ({ id, decrement: 10 })),
        ...(item.customizations?.sauce || []).map((id) => ({ id, decrement: 5 })),
        ...(item.customizations?.cheese || []).map((id) => ({ id, decrement: 5 })),
        ...(item.customizations?.toppings || []).map((id) => ({ id, decrement: 10 })),
      ].filter(Boolean);

      for (const { id, decrement } of inventoryItems) {
        bulkOps.push({
          updateOne: {
            filter: { _id: id },
            update: { $inc: { stock: -quantity * decrement } },
          },
        });
      }
    }

    // Execute batch stock update
    if (bulkOps.length > 0) {
      await Inventory.bulkWrite(bulkOps);
    }

    next();
  } catch (error) {
    console.error("Error in order post-save middleware:", error);
    next(error);
  }
});

orderSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    // Fetch the updated document explicitly
    const updatedDoc = await this.model.findOne(this.getQuery()).lean();

    if (!updatedDoc || updatedDoc.status !== "cancelled") {
      return next();
    }

    const bulkOps = [];

    // Prepare batch stock increment operations
    for (const item of updatedDoc.items) {
      const quantity = item.quantity;

      // Increase stock for pizza ingredients
      const pizza = await mongoose.model("Pizza").findById(item.pizza)
        .populate("base sauce cheese toppings")
        .lean();

      const inventoryItems = [
        { id: item.customizations.base || pizza.base, increment: 1 },
        ...(pizza.sauce || []).map((id) => ({ id, increment: 5 })),
        ...(pizza.cheese || []).map((id) => ({ id, increment: 5 })),
        ...(pizza.toppings || []).map((id) => ({ id, increment: 10 })),
        ...(item.customizations?.sauce || []).map((id) => ({ id, increment: 5 })),
        ...(item.customizations?.cheese || []).map((id) => ({ id, increment: 5 })),
        ...(item.customizations?.toppings || []).map((id) => ({ id, increment: 10 })),
      ].filter(Boolean);

      for (const { id, increment } of inventoryItems) {
        bulkOps.push({
          updateOne: {
            filter: { _id: id },
            update: { $inc: { stock: quantity * increment } },
          },
        });
      }
    }

    // Execute batch stock update
    if (bulkOps.length > 0) {
      await Inventory.bulkWrite(bulkOps);
    }

    next();
  } catch (error) {
    console.error("Error in order post-update middleware:", error);
    next(error);
  }
});

export const Order = mongoose.model("Order", orderSchema);
