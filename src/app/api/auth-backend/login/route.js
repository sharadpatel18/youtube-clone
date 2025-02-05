import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const existedUser = await User.findOne({ email });

    if (!existedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const comparedPassword = await bcrypt.compare(
      password,
      existedUser.password
    );

    if (!comparedPassword) {
      return NextResponse.json({ message: "Wrong password" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: existedUser._id,
        name: existedUser.username,
        email: existedUser.email,
        profilePicture: existedUser.profilePicture,
        coverPicture: existedUser.coverPicture,
        subscribers: existedUser.subscribers,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ message: "Login successful!", token });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
