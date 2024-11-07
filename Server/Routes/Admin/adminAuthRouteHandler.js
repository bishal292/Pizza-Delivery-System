import { Router } from "express";
import { verifyToken } from "../../Middlewares/AuthMiddleware.js";
import { AdminInfo, forgotpassword, logIn, logOut, resetpassword, signUp, changePassword} from "../../Controllers/Admin/AdminAuthController.js";

const adminAuthRouter = Router();

adminAuthRouter.post('/login',logIn);
adminAuthRouter.post('/signup', signUp);
adminAuthRouter.get('/logout',verifyToken,logOut);
adminAuthRouter.patch('/changepassword',verifyToken, changePassword);
adminAuthRouter.post('/forgotpassword', forgotpassword);
adminAuthRouter.patch('/resetpassword/:token', resetpassword);
adminAuthRouter.get('/admin-info', verifyToken,AdminInfo);


export default adminAuthRouter;