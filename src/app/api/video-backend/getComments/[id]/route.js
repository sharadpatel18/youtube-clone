import {  NextResponse, } from 'next/server';
import Video from "@/models/VideoSchema";
import { DbConntection } from "@/utils/db";

export async function GET(req, { params }) {
    await DbConntection();
    const { id } = params; // Get video ID from URL
    try {
        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        return NextResponse.json({ comments: video.comments }, { status: 200 });

    } catch (error) {
        console.error("Error getting comments:", error);
        return NextResponse.json({ error: "Error getting comments" }, { status: 500 });
    }
}
