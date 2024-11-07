import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/dbConfig.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AdminRouter from './Routes/Admin/AdminRoutes.js';
import UserRouter from './Routes/User/UserRoutes.js';

dotenv.config();

connectDB();//Connecting to Database-MongoDB.
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(cookieParser());

// Cors for cross connection between frontend and backend.
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE'],
}));


app.use('/',(req, res, next) => {
    console.log(`Request Method: ${req.method} Request URL: ${req.url}`);
    next();    
});

app.use('/api/v1/admin/',AdminRouter);
app.use('/api/v1/user/',UserRouter);

app.get("/",(req, res, next) => {
    res.send('Hello World');
    next();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});