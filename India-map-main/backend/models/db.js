import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = "unico_project";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`Database connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;
