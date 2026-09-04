import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {

  if (isConnected) {
    console.log("MongoDB already connected ✅");
    return;
  }

  try {

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "lms",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;

    console.log(`MongoDB Connected: ${conn.connection.host} ✅`);

  } catch (error) {

    console.error("MongoDB connection failed ❌", error.message);

    process.exit(1);

  }

};

export default connectDB;