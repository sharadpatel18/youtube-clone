import { NextResponse } from "next/server";
import { DbConntection } from "@/utils/db";
import Playlist from "@/models/playListSchema";

export async function GET(req, { params }) {
    await DbConntection();
    const { id } = params; // Get playlist ID from URL
    try {
        const playlist = await Playlist.findById(id);
        if (!playlist) return NextResponse.json({ message: "Playlist not found" }, { status: 404 });

        return NextResponse.json({ playlist }, { status: 200 });

    } catch (error) {
        console.error("Error getting playlist:", error);
        return NextResponse.json({ error: "Error getting playlist" }, { status: 500 });
    }
}
