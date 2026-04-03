import mongoose from "mongoose";
import dotenv from "dotenv";
import AptitudeQuestion from "./models/aptitudeQuestion.model.js";

dotenv.config();

const clearAndReseed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✓ Connected to MongoDB");

    const result = await AptitudeQuestion.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} existing questions`);

    await mongoose.disconnect();
    console.log("✓ MongoDB connection closed");
  } catch (error) {
    console.error("Error clearing questions:", error.message);
  }
};

clearAndReseed();
