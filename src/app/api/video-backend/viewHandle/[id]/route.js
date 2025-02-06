import { DbConntection } from "@/utils/db";
import Video from "@/models/VideoSchema";
import { NextResponse } from "next/server";

DbConntection();

export async function PATCH(req , {params}) {
    const { id } = params;  // Get video ID from URL
    const { views } = await req.json(); // Get user ID from request body
    try {
        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        // Check if the user has already viewed the video
        // if (!video.views.includes(userId)) {
        //     video.views.push(userId); // Add userId to views array
        //     await video.save();
        // }

        video.views = views;
        const updatedVideo = await Video.findByIdAndUpdate(video._id, video, { new: true });

        return NextResponse.json({ message: "Views updated successfully" });

    } catch (error) {
        console.error("Error updating views:", error);
        return NextResponse.json({ error: "Error updating views" }, { status: 500 });
    }
}
