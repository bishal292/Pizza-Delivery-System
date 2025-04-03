import mongoose from "mongoose";
import { Pizza } from "./PizzaModels.js";
import { sendEmailToAdmins } from "../../utils/util-functions.js";
import { io } from "../../utils/Socket.js"; // Import the socket instance

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["cheese", "sauce", "base", "topping", "baseSize"],
      required: true,
    },
    type: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: [0, "Stock cannot be below 0"] },
    threshold: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "out of stock"],
      default: "available",
    },
  },
  { timestamps: true }
);

// Whenever the stock is updated, the status will be updated as well
inventorySchema.pre("save", function (next) {
  this.status = this.stock <= 0 ? "out of stock" : "available";
  next();
});


inventorySchema.post("save", async function (doc, next) {
  try {
    if (doc.stock <= 0) {
      doc.status = "out of stock";
      await doc.save();

      console.log(`Inventory item '${doc.name}' is out of stock`);

      // Find all pizzas that use this inventory item
      const pizzasToUpdate = await Pizza.find({
        $or: [
          { base: doc._id }, // Ensure only the _id is used
          { sauce: doc._id },
          { cheese: doc._id },
          { toppings: doc._id },
        ],
      });

      if (pizzasToUpdate.length > 0) {
        const bulkOps = pizzasToUpdate.map((pizza) => ({
          updateOne: {
            filter: { _id: pizza._id },
            update: { status: "unavailable" },
          },
        }));

        // Bulk update pizza status
        await Pizza.bulkWrite(bulkOps);

        console.log(`Updated ${pizzasToUpdate.length} pizzas to 'unavailable'`);
      }
    }

    // Check if stock is below the threshold
    if (doc.stock > 0 && doc.stock <= doc.threshold) {
      // Send email to admins
      const lowStockItem = {
        name: doc.name,
        category: doc.category,
        stock: doc.stock,
        threshold: doc.threshold,
      };

      const emailResult = await sendEmailToAdmins({
        subject: "Low Stock Alert",
        message: `The following item is running low on stock:\n\n${JSON.stringify(
          lowStockItem,
          null,
          2
        )}`,
      });

      if (!emailResult) {
        console.warn(`No recipients defined for low stock alert email for item '${doc.name}'`);
      } else {
        console.log(`Low stock alert email sent for item '${doc.name}'`);
      }

      // Emit socket event to admins
      if (io.adminSocketMap && typeof io.adminSocketMap.values === "function") {
        const adminSocketIds = [...io.adminSocketMap.values()]; // Get all admin socket IDs
        adminSocketIds.forEach((socketId) => {
          io.to(socketId).emit("lowStockAlert", lowStockItem);
        });

        console.log(`Low stock alert emitted for item '${doc.name}'`);
      } else {
        console.warn("Socket map is not initialized or invalid");
      }
    }

    next();
  } catch (error) {
    console.error("Error in inventory post-save middleware:", error);
    next(error);
  }
});

inventorySchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    if (!doc) {
      console.warn("No document found for deletion");
      return next();
    }

    console.log(`Inventory item '${doc.name}' is being deleted`);

    const pizzasToUpdate = await Pizza.find({
      $or: [
        { base: doc._id },
        { sauce: doc._id },
        { cheese: doc._id },
        { toppings: doc._id },
      ],
    });

    if (pizzasToUpdate.length > 0) {
      const bulkOps = pizzasToUpdate.map((pizza) => ({
        updateOne: {
          filter: { _id: pizza._id },
          update: {
            $pull: {
              base: doc._id,
              sauce: doc._id,
              cheese: doc._id,
              toppings: doc._id,
            },
          },
        },
      }));

      await Pizza.bulkWrite(bulkOps);
      console.log(`Removed item '${doc.name}' from ${pizzasToUpdate.length} pizzas`);
    } else {
      console.log(`No pizzas found using item '${doc.name}'`);
    }

    const Order = mongoose.model("Order");
    const ordersToUpdate = await Order.updateMany(
      { "customizations.inventoryItem": doc._id },
      { $pull: { customizations: { inventoryItem: doc._id } } }
    );
    console.log(`Removed item '${doc.name}' from ${ordersToUpdate.modifiedCount} orders`);

    next();
  } catch (error) {
    console.error("Error in inventory pre-remove middleware:", error);
    next(error);
  }
});

export const Inventory = mongoose.model("Inventory", inventorySchema);
