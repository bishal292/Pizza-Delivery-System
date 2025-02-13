import mongoose from "mongoose";

const blockedCookiesSchema = new mongoose.Schema({
  cookie: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: { type: Date, default: Date.now, expires: "3d" },
});

export default mongoose.model("BlockedCookies", blockedCookiesSchema);