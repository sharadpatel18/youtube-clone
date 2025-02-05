import { NextResponse } from "next/server";
import Video from "@/models/VideoSchema";
import { DbConntection } from "@/utils/db";

DbConntection()
export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.videoUrl) {
      return NextResponse.json(
        { error: "No video data provided" },
        { status: 400 }
      );
    }

    const newRecording = new Video(data);
    await newRecording.save();
    return NextResponse.json(
      { message: "File uploaded successfully" , data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}