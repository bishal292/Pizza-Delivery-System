import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../db/models/UserModel.js";
import { Admin } from "../db/models/AdminModel.js";
dotenv.config();

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).send("You are not Authenticated.");
    jwt.verify(token, process.env.JWT_KEY, async (err, user) => {

        if(err) return res.status(403).send("token not valid!");
        req.userId = user.userId;
        console.log(user.userId)
        next();
    });
}



export const getUserInfo =async(req,res,next)=>{
    try {
        const userId = req.userId;
        if (!userId) return res.status(400).send("You are not logged in");

        const user = await User.findById(userId);
        if (!user){
            const admin = await Admin.findById(userId);
            if(!admin) return res.status(404).send("No Such User Found");
            return res.status(200).json({
                message: "Admin Info",
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: 'admin'
            });
        }
        return res.status(200).json({
            message: "User Info",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: 'user'
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}