import mongoose from "mongoose";

const PlayListSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        username: { type: String, required: true },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        playList: {
            type: [mongoose.Schema.Types.ObjectId], // Ensure it's always an array
            ref: "Video",
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true } // Automatically adds createdAt & updatedAt
);

const PlayList = mongoose.models.PlayList || mongoose.model("PlayList", PlayListSchema);

export default PlayList;
