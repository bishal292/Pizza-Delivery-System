import { Router } from "express";
import userAuthRouter from "./userAuthRoutesHandler.js";
import {
  getPizzas,
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  getOptions,
  placeOrder,
  getOrders,
  getOrderDetails,
  cancelOrder,
  completePayment,
} from "../../Controllers/User/UserMiscControllers.js";
import { verifyToken } from "../../Middlewares/AuthMiddleware.js";
import { verifyPayment } from "../../Services/RazorPay.js";

const UserRouter = Router();

UserRouter.use('/auth', userAuthRouter);

UserRouter.get('/pizzas', getPizzas);
UserRouter.post('/cart',verifyToken, addToCart);
UserRouter.get('/cart',verifyToken, getCart);
UserRouter.delete('/cart',verifyToken, removeFromCart);
UserRouter.get('/options', getOptions);// Get all the options for customizing the pizza
UserRouter.delete('/cart/clear',verifyToken, clearCart);
UserRouter.post('/place-order',verifyToken, placeOrder);
UserRouter.get('/orders',verifyToken, getOrders);
UserRouter.get('/order/details',verifyToken, getOrderDetails);
UserRouter.post("/order/verify-payment",verifyToken, verifyPayment);
UserRouter.get("/order/complete-payment",verifyToken, completePayment);
UserRouter.get("/order/cancel",verifyToken, cancelOrder);
export default UserRouter;