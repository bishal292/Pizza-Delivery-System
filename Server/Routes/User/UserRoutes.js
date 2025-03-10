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
  getOrder
} from "../../Controllers/User/UserMiscControllers.js";
import { verifyToken } from "../../Middlewares/AuthMiddleware.js";

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
UserRouter.get('/orders/:orderId',verifyToken, getOrder);

export default UserRouter;