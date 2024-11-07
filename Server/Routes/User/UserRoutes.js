import { Router } from "express";
import userAuthRouter from "./userAuthRoutes.js";

const UserRouter = Router();

UserRouter.use('/auth', userAuthRouter);

export default UserRouter;