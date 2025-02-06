// models/Video.js

import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: { 
      type: String,
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    videoUrl: { 
      type: String, 
      required: true 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    profilePicture: { type: String, required: true },
    views: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          username: { type: String, required: true },
        },
      ],
      require: true,
      default: [],
    },
    likes: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          username: { type: String, required: true },
        },
      ],
      require: true,
      default: [],
    },
    dislikes: {
      type: Number,
      require: true,
      default: 0,
    },
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
      },
    ],
    thumbnail: {
      type: String,
      default: "",
    },
  },
  
  { timestamps: true }
);

const Video = mongoose.models.Video || mongoose.model("Video", VideoSchema);
export default Video;
