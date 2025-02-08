import { NextResponse } from "next/server";
import Video from "@/models/VideoSchema";
import { DbConntection } from "@/utils/db";

export async function POST(req) {
    await DbConntection();
    const {videoId , userId , username , comment} = await req.json();
   try {
        console.log(videoId , userId , username , comment);
        
        const video = await Video.findById(videoId);
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        const newComment = {
            userId,
            username,
            comment,
        };
        console.log(video);
        
        video.comments.push(newComment);
        await video.save();

        return NextResponse.json({ message: "Comment added successfully", comment: newComment }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Error adding comment to video" },
            { status: 500 }
        );
    }
}