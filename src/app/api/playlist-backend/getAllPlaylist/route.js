import { NextResponse } from "next/server";
import { DbConntection } from "@/utils/db";
import Playlist from "@/models/playListSchema";
import Video from "@/models/VideoSchema";

export async function GET() {
    await DbConntection();

    try {
        // Fetch all playlists
        const playlists = await Playlist.find({});

        // Array to store playlists with their associated videos
        const playlistsWithVideos = [];

        // Loop through each playlist
        for (const playlist of playlists) {
            // Fetch videos for the current playlist
            const videos = await Video.find({ _id: { $in: playlist.playList } });

            // Add the playlist and its videos to the result array
            playlistsWithVideos.push({
                ...playlist.toObject(), // Convert Mongoose document to plain object
                videos, // Add the fetched videos
            });
        }
        
        // Return the playlists with their associated videos
        return NextResponse.json({ playlists: playlistsWithVideos }, { status: 200 });
    } catch (error) {
        console.error("Error getting playlists:", error);
        return NextResponse.json({ error: "Error getting playlists" }, { status: 500 });
    }
}