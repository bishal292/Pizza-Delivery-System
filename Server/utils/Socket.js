import { Server as SocketIOServer } from "socket.io";
import { Cart } from "../db/models/CartModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    const disconnectUser = (socket) => {
        console.log(`User disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socked ID: ${socket.id}`);
        } else {
            console.log(`user ID not provided during connection.`);
        }
        
        socket.on("disconnect", () => {
            disconnectUser(socket);
        });

        socket.on("increase-quantity", async ({ pizzaId, index }, callback) => {
            console.log("Increase quantity", pizzaId, index);
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
                    return callback({ status: "error", error: "Maximum quantity reached" });
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
                    return callback({ status: "error", error: "Minimum quantity reached" });
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

export default setupSocket;