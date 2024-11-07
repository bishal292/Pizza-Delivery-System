import { Router } from "express";
import adminAuthRouter from "./adminAuthRouteHandler.js";

const AdminRouter = Router();

AdminRouter.use('/auth', adminAuthRouter);

AdminRouter.get('/dashboard', (req, res, next) => {
    res.status(200).send('Admin Dashboard');
    next();
});

AdminRouter.get('/inventory', (req, res, next) => {
    res.send('Admin Products');
    next();
});
AdminRouter.post('/addproduct', (req, res, next) => {
    res.send('Admin Product Added');
    next();
});
AdminRouter.patch('/updateproduct/:id', (req, res, next) => {
    res.send('Admin Product Updated with id: '+req.params.id);
    next();
});

AdminRouter.get('/orders', (req, res, next) => {
    res.send('Admin Orders');
    next();
});
AdminRouter.patch('/updateorder/:id', (req, res, next) => {
    res.send('Admin Order status Updated with id: '+req.params.id);
    next();
});
AdminRouter.get('/completedorders', (req, res, next) => {
    res.send('Admin Completed Orders');
    next();
});

export default AdminRouter;