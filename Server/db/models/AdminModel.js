import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});


export const Admin = mongoose.model("Admin", AdminSchema);