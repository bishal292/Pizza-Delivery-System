import { Server as SocketIOServer } from "socket.io";
import { Cart } from "../db/models/CartModel.js";
import { Admin } from "../db/models/AdminModel.js";
import mongoose from "mongoose"; // Import mongoose to validate ObjectId

let io; // Declare the io instance
export const adminSocketMap = new Map();
export const userSocketMap = new Map();

const setupSocket = (server) => {
  if (io) {
    // If io is already defined, return it without creating a new instance
    return io;
  }
  io = new SocketIOServer(server, {
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = process.env.CLIENT_URLS
          ? process.env.CLIENT_URLS.split(",").map((url) => url.trim())
          : []; // Handle undefined or improperly formatted CLIENT_URLS
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
    },
  });

  const disconnectUser = (socket) => {
    const userId = [...userSocketMap.entries()].find(
      ([key, value]) => value === socket.id
    )?.[0];
    if (userId) {
      userSocketMap.delete(userId);
      console.log(`User disconnected: ${userId}`);
    } else {
      const adminId = [...adminSocketMap.entries()].find(
        ([key, value]) => value === socket.id
      )?.[0];
      if (adminId) {
        adminSocketMap.delete(adminId);
        console.log(`Admin disconnected: ${adminId}`);
      }
    }
  };

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    // Validate userId
    if (!userId || !mongoose.isValidObjectId(userId)) {
      console.log("Invalid or missing userId during connection.");
      return socket.disconnect(true); // Disconnect the socket if userId is invalid
    }

    try {
      const admin = await Admin.findById(userId);
      if (admin) {
        adminSocketMap.set(userId, socket.id);
        console.log(`Admin connected: ${userId} with socket ID: ${socket.id}`);
      } else {
        userSocketMap.set(userId, socket.id);
        console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
      }
    } catch (error) {
      console.error("Error during user/admin identification:", error.message);
      return socket.disconnect(true); // Disconnect the socket on error
    }

    socket.on("disconnect", () => {
      disconnectUser(socket);
    });

    socket.on("increase-quantity", async ({ pizzaId, index }, callback) => {
      try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
          return callback({ status: "error", error: "Cart not found" });
        }
        if (index < 0 || index >= cart.items.length) {
          return callback({ status: "error", error: "Invalid index" });
        }
        const item = cart.items[index];
        if (item.pizza.toString() !== pizzaId) {
          return callback({ status: "error", error: "Pizza ID mismatch" });
        }
        if (item.quantity >= 10) {
          return callback({
            status: "error",
            error: "Maximum quantity reached",
          });
        }
        item.quantity += 1;
        item.finalPrice = item.price * item.quantity;
        await cart.save();
        callback({ status: "ok", data: { newQuantity: item.quantity } });
      } catch (error) {
        console.error(error.message);
        callback({ status: "error", error: "Internal Server Error" });
      }
    });

    socket.on("decrease-quantity", async ({ pizzaId, index }, callback) => {
      try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
          return callback({ status: "error", error: "Cart not found" });
        }
        if (index < 0 || index >= cart.items.length) {
          return callback({ status: "error", error: "Invalid index" });
        }
        const item = cart.items[index];
        if (item.pizza.toString() !== pizzaId) {
          return callback({ status: "error", error: "Pizza ID mismatch" });
        }
        if (item.quantity <= 1) {
          return callback({
            status: "error",
            error: "Minimum quantity reached",
          });
        }
        item.quantity -= 1;
        item.finalPrice = item.price * item.quantity;
        await cart.save();
        callback({ status: "ok", data: { newQuantity: item.quantity } });
      } catch (error) {
        console.error(error.message);
        callback({ status: "error", error: "Internal Server Error" });
      }
    });
  });
};

export { setupSocket, io }; // Export both setupSocket and io
