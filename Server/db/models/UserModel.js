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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});


UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.passwordChangedAt = Date.now() - 1000;
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

UserSchema.methods.createResetPasswordToken = function () {

    const resetToken = crypto.randomBytes(32).toString("hex");
    
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
   
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
  };

export const User = mongoose.model("User", UserSchema);