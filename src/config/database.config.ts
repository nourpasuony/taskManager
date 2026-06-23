import mongoose from "mongoose";
import { Env } from "./env.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(Env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected on Port: ${mongoose.connection.port}`);
  } catch (error) {
    console.error(`Error Connected To MongoDB: ${error}`);
    process.exit(1); 
  }
};

export default connectDB;
