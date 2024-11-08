import { Router } from "express";
import userAuthRouter from "./userAuthRoutesHandler.js";

const UserRouter = Router();

UserRouter.use('/auth', userAuthRouter);

export default UserRouter;