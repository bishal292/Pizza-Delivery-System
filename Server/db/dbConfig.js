import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// export const connectDB = async () => {
//     const connection_String = process.env.DB_URL;
//     try {
//         await mongoose.connect(connection_String);
//         console.log("MongoDB Connected Successfully");
//     } catch (error) {
//         console.error("Error Connecting with MongoDB:", error);
//     }
// };


let cachedConnection = null;

export async function connectDB() {
  if (!process.env.DB_URL) {
    throw new Error("DB_URL is not defined in environment variables.");
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.DB_URL, {
      useUnifiedTopology: true,
    });

    cachedConnection = conn;
    console.log("MongoDB connected");
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function getDBConnection() {
  if (mongoose.connection.readyState !== 1) {
    return connectDB();
  }
  return mongoose.connection;
}