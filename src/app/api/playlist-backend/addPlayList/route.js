import { NextResponse } from "next/server";
import PlayList from "@/models/playListSchema";
import { DbConntection } from "@/utils/db";
import mongoose from "mongoose";

export async function POST(req) {
    await DbConntection();

    if (req.method !== "POST") {
        return NextResponse.json(
            { error: "Method not allowed." },
            { status: 405 }
        );
    }

    try {
        const { title, playList, isPublic, userId, username } = await req.json();

        if (!title || !playList || !userId || !username) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        // Ensure playList is an array of ObjectIds
        const playListArray = Array.isArray(playList) ? playList : [playList];

        // Convert playlist IDs to ObjectId
        const formattedPlayList = playListArray.map(id => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid video ID: ${id}`);
            }
            return new mongoose.Types.ObjectId(id);
        });

        const newPlaylist = await PlayList.create({
            title,
            playList: formattedPlayList,
            isPublic,
            userId: new mongoose.Types.ObjectId(userId),
            username,
        });

        return NextResponse.json(
            { message: "Playlist created successfully.", playlist: newPlaylist },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating playlist:", error.message || error);
        return NextResponse.json(
            { error: error.message || "Internal server error." },
            { status: 500 }
        );
    }
}
