import { Router } from "express";

const userAuthRouter = Router();

userAuthRouter.post('/login', (req, res, next) => {
    res.send('Admin Login');
    next();
});
userAuthRouter.post('/signup', (req, res, next) => {
    res.send('Admin Registered');
    next();
});
userAuthRouter.get('/forgotpassword', (req, res, next) => {
    res.send('Admin Forgot Password');
    next();
});
userAuthRouter.post('/resetpassword', (req, res, next) => {
    res.send('Admin Reset Password');
    next();
});
userAuthRouter.get('/logout', (req, res, next) => {
    res.send('Admin Logout');
    next();
});


export default userAuthRouter;