import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { DbConntection } from "@/utils/db";

DbConntection()
export async function POST(request) {
    try {
        const { username, email, password, profilePicture, coverPicture } = await request.json();

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return NextResponse.json({
                message: "User already exists",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            profilePicture,
            coverPicture
        });

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            user
        });
    } catch (error) {
        return NextResponse.json({
            message: "An error occurred",
            success: false,
            error: error.message
        });
    }
}
