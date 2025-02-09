import Video from "@/models/VideoSchema";
import { NextResponse } from "next/server";
import { DbConntection } from "@/utils/db";

DbConntection();
export async function GET(req) {
    try {

        const videos = await Video.find({});
        return NextResponse.json({ videos }, { status: 200 });
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }
}