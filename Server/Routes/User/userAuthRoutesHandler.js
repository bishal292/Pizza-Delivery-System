import { Router } from "express";
import {verifyToken} from "../../Middlewares/AuthMiddleware.js"
import { UserInfo, forgotpassword, logIn, logOut, resetpassword, signUp, changePassword} from "../../Controllers/User/userAuthController.js";


const userAuthRouter = Router();


userAuthRouter.post('/login',logIn);
userAuthRouter.post('/signup', signUp);
userAuthRouter.get('/logout',verifyToken,logOut);
userAuthRouter.patch('/changepassword',verifyToken, changePassword);
userAuthRouter.post('/forgotpassword', forgotpassword);
userAuthRouter.patch('/resetpassword/', resetpassword);
userAuthRouter.get('/user-info', verifyToken,UserInfo);


export default userAuthRouter;