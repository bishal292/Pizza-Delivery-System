import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: Array,
        default: [],
    },
    orders: {
        type: Array,
        default: [],
    },
    customPizza:{
        type: Array,
        default: [],
    }
});


UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

export const User = mongoose.model("User", UserSchema);