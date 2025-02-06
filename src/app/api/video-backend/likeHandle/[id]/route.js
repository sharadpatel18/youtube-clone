import { DbConntection } from "@/utils/db";
import Video from "@/models/VideoSchema";
import { NextResponse } from "next/server";

DbConntection();

export async function PATCH(req , {params}) {
    const { id } = params;  // Get video ID from URL
    const { likes } = await req.json(); // Get user ID from request body
    try {
        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        // Check if the user has already viewed the video
        // if (!video.views.includes(userId)) {
        //     video.views.push(userId); // Add userId to views array
        //     await video.save();
        // }

        video.likes = likes;
        const updatedVideo = await Video.findByIdAndUpdate(video._id, video, { new: true });
        console.log(updatedVideo);
        

        return NextResponse.json({ message: "Likes updated successfully" });

    } catch (error) {
        console.error("Error updating views:", error);
        return NextResponse.json({ error: "Error updating views" }, { status: 500 });
    }
}
