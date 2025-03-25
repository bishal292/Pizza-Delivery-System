import { Router } from "express";
import adminAuthRouter from "./adminAuthRouteHandler.js";
import { verifyToken } from "../../Middlewares/AuthMiddleware.js";
import {
  addPizza,
  addProduct,
  allOrders,
  dashboard,
  deletePizza,
  deleteProduct,
  deleteUser,
  getAllUsers,
  getOrderAccStatus,
  getPizzaDetails,
  getPizzas,
  getUserCart,
  getUserWithNameOrEmail,
  imageUpload,
  inventory,
  OrderDetails,
  updateOrderStatus,
  updatePizza,
  updateProduct,
  updateUser,
  userOrders,
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

// Admin - User Routes
AdminRouter.get("/users-list", verifyToken, getAllUsers);
AdminRouter.get("/user/search", verifyToken, getUserWithNameOrEmail);
AdminRouter.patch("/update-user", verifyToken, updateUser);
AdminRouter.delete("/delete-user", verifyToken, deleteUser);

AdminRouter.get("/user/cart",verifyToken,getUserCart)

// Admin -> User - Order Details
AdminRouter.get("/orders", verifyToken, allOrders);
AdminRouter.patch("/order", verifyToken, updateOrderStatus);
AdminRouter.get("/user/orders", verifyToken, userOrders);
AdminRouter.get("/orders/filtered", verifyToken, getOrderAccStatus); // -> GET -> status : query -> orders according to given valid status like "completed" or "pending"
AdminRouter.get("/order/detail", verifyToken, OrderDetails);

export default AdminRouter;
