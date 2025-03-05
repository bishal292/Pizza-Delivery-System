import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/dbConfig.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AdminRouter from './Routes/Admin/AdminRoutes.js';
import UserRouter from './Routes/User/UserRoutes.js';
import { getUserInfo, verifyToken } from './Middlewares/AuthMiddleware.js';
import { logOut } from './Controllers/User/userAuthController.js';

dotenv.config();

connectDB();//Connecting to Database-MongoDB.
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(cookieParser());

// Serve static files from the 'uploads' directory
app.use('/pizza-image', express.static('uploads'));

// Cors for cross connection between frontend and backend.
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH','DELETE'],
}));

// Middleware to get logged user info along with its role(Admin | user).
app.use("*",(req, res, next) => {
    console.log(req.method, req.path);
    next();
});

app.get("/api/v1/auth/get-user-info",verifyToken,getUserInfo);

app.use('/api/v1/admin/',AdminRouter);
app.use('/api/v1/user/',UserRouter);

app.get("/",(req, res, next) => {
    res.send('Hello World');
    next();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});