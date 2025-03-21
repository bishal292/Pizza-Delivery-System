import { Router } from "express";
import adminAuthRouter from "./adminAuthRouteHandler.js";
import { verifyToken } from "../../Middlewares/AuthMiddleware.js";
import {
  addPizza,
  addProduct,
  CompletedOrders,
  dashboard,
  deletePizza,
  deleteProduct,
  deleteUser,
  getAllUsers,
  getPizzaDetails,
  getPizzas,
  getUserCart,
  getUserWithNameOrEmail,
  imageUpload,
  inventory,
  liveOrders,
  OrderDetails,
  updateOrderStatus,
  updatePizza,
  updateProduct,
  updateUser,
} from "../../Controllers/Admin/AdminMiscController.js";
import { upload } from "../../utils/util-functions.js";

const AdminRouter = Router();

// Middleware for All the auth Routes related to Admin.
AdminRouter.use("/auth", adminAuthRouter);

AdminRouter.get("/dashboard", verifyToken, dashboard);

// Admin - Inventory Routes
AdminRouter.get("/inventory", verifyToken, inventory);
AdminRouter.post("/addproduct", verifyToken, addProduct);
AdminRouter.patch("/updateproduct", verifyToken, updateProduct);
AdminRouter.delete("/deleteproduct", verifyToken, deleteProduct);

// Admin - pizza Routes
AdminRouter.post(
  "/pizza/upload",
  verifyToken,
  upload.single("image"),
  imageUpload
);
AdminRouter.get("/get-pizzas", verifyToken, getPizzas);
AdminRouter.get("/pizza/get-pizza-details", verifyToken, getPizzaDetails);
AdminRouter.post("/addpizza", verifyToken, addPizza);
AdminRouter.patch("/updatepizza", verifyToken, updatePizza);
AdminRouter.delete("/deletepizza", verifyToken, deletePizza);

// Admin - Order Routes
AdminRouter.get("/orders", verifyToken, liveOrders);
AdminRouter.patch("/updateorder/:orderId", verifyToken, updateOrderStatus);
AdminRouter.get("/completedorders", verifyToken, CompletedOrders);

// Admin - User Routes
AdminRouter.get("/users-list", verifyToken, getAllUsers);
AdminRouter.get("/user/search", verifyToken, getUserWithNameOrEmail);
AdminRouter.patch("/update-user", verifyToken, updateUser);
AdminRouter.delete("/delete-user", verifyToken, deleteUser);
AdminRouter.get("/user/cart",verifyToken,getUserCart)
AdminRouter.get("/user-order-details", verifyToken, OrderDetails);

export default AdminRouter;
