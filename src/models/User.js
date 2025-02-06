import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    subscribers: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          username: { type: String, required: true },
        },
      ],
      require: true,
      default: [],
    },
    subscribedChannels: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          username: { type: String, required: true },
        },
      ],
      require: true,
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
