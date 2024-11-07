import { Router } from "express";
import adminAuthRouter from "./adminAuthRouteHandler.js";
import { verifyToken } from "../../Middlewares/AuthMiddleware.js";
import { addProduct, CompletedOrders, dashboard, inventory, liveOrders, updateOrderStatus, updateProduct } from "../../Controllers/Admin/AdminMiscController.js";

const AdminRouter = Router();


// Middleware for All the auth Routes related to Admin.
AdminRouter.use('/auth', adminAuthRouter);

AdminRouter.get('/dashboard',verifyToken,dashboard);

AdminRouter.get('/inventory',verifyToken,inventory);
AdminRouter.post('/addproduct',verifyToken,addProduct);
AdminRouter.patch('/updateproduct/:id',verifyToken, updateProduct);

AdminRouter.get('/orders',verifyToken, liveOrders);
AdminRouter.patch('/updateorder/:id',verifyToken, updateOrderStatus);
AdminRouter.get('/completedorders',verifyToken,CompletedOrders);

export default AdminRouter;