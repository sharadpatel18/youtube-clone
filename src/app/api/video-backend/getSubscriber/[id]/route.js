import { NextResponse } from "next/server";
import User from "@/models/User";
import { DbConntection } from "@/utils/db";

DbConntection();

export async function GET(req, { params }) {
  const { id } = params; // Get video ID from URL
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error getting user subscribers:", error);
    return NextResponse.json(
      { error: "Error getting user subscribers" },
      { status: 500 }
    );
  }
}
