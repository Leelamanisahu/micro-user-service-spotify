import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router/route.js";

dotenv.config();
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "Spotify",
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
