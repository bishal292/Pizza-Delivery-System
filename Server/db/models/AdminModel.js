import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.passwordChangedAt = Date.now() - 1000;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Instance method to create password reset token on Admin instances.
AdminSchema.methods.createResetPasswordToken = function () {

  const resetToken = crypto.randomBytes(32).toString("hex");
  
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
 
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export const Admin = mongoose.model("Admin", AdminSchema);