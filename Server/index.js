import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/dbConfig.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AdminRouter from './Routes/Admin/AdminRoutes.js';
import UserRouter from './Routes/User/UserRoutes.js';
import { getUserInfo, verifyToken } from './Middlewares/AuthMiddleware.js';
import http from 'http';
import setupSocket from './utils/Socket.js';

dotenv.config();

connectDB();//Connecting to Database-MongoDB.
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(cookieParser());

// Serve static files from the 'uploads' directory
app.use('/pizza-image', express.static('uploads'));

export const server = http.createServer(app);

// Cors for cross connection between frontend and backend.
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = process.env.CLIENT_URLS 
            ? process.env.CLIENT_URLS.split(',').map(url => url.trim()) 
            : []; // Handle undefined or improperly formatted CLIENT_URLS
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

// Middleware to get logged user info along with its role(Admin | user).
// app.use("*",(req, res, next) => {
//     `console`.log(req.method, req.path);
//     next();
// });

app.get("/api/v1/auth/get-user-info",verifyToken,getUserInfo);

app.use('/api/v1/admin/',AdminRouter);
app.use('/api/v1/user/',UserRouter);

app.get("/",(req, res, next) => {
    res.send('Hello World');
    next();
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

setupSocket(server);