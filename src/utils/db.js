import mongoose from "mongoose";

export async function DbConntection() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "youtube-clone",
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error connecting to database", error.message);
    }
}