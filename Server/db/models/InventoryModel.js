import mongoose from "mongoose";
import { Pizza } from "./PizzaModels.js";
import { sendEmailToAdmins } from "../../utils/util-functions.js";
import { io } from "../../utils/Socket.js"; // Import the socket instance

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["cheese", "sauce", "base", "topping", "BaseSize"],
      required: true,
    },
    type: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
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
  this.status = this.stock == 0 ? "out of stock" : "available";
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

      await sendEmailToAdmins({
        subject: "Low Stock Alert",
        message: `The following item is running low on stock:\n\n${JSON.stringify(
          lowStockItem,
          null,
          2
        )}`,
      });

      console.log(`Low stock alert email sent for item '${doc.name}'`);

      // Emit socket event to admins
      const adminSocketIds = [...io.adminSocketMap.values()]; // Get all admin socket IDs
      adminSocketIds.forEach((socketId) => {
        io.to(socketId).emit("lowStockAlert", lowStockItem);
      });

      console.log(`Low stock alert emitted for item '${doc.name}'`);
    }

    next();
  } catch (error) {
    console.error("Error in inventory post-save middleware:", error);
    next(error);
  }
});

export const Inventory = mongoose.model("Inventory", inventorySchema);
