import { Router } from "express";
import userAuthRouter from "./userAuthRoutesHandler.js";
import {
  getPizzas,
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  getOptions,
} from "../../Controllers/User/UserMiscControllers.js";
import { verifyToken } from "../../Middlewares/AuthMiddleware.js";

const UserRouter = Router();

UserRouter.use('/auth', userAuthRouter);

UserRouter.get('/pizzas', getPizzas);
UserRouter.post('/cart',verifyToken, addToCart);
UserRouter.get('/cart',verifyToken, getCart);
UserRouter.delete('/cart',verifyToken, removeFromCart);
UserRouter.get('/options', getOptions);
UserRouter.delete('/cart/clear',verifyToken, clearCart);

export default UserRouter;