import mongoose from "mongoose";

export async function DbConntection() {
  try {
    // if (mongoose.connection.readyState >= 1) {
    //   console.log("Already connected to MongoDB");
    //   return;
    // }

    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "youtube-clone",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 40000,
    });
    
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
  }
}
