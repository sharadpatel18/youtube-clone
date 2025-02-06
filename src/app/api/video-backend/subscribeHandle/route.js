import { NextResponse } from "next/server";
import User from "@/models/User"; // Import your User model
import { DbConntection } from "@/utils/db";

DbConntection();

export async function POST(req) {
  const { subscriberId, channelId } = await req.json();
  console.log(subscriberId, channelId);

  try {
    // Find the subscriber and channel
    const subscriber = await User.findById(subscriberId);
    const channel = await User.findById(channelId);

    if (!subscriber || !channel) {
      return NextResponse.json(
        { error: "Subscriber or channel not found" },
        { status: 404 }
      );
    }

    // Check if the user is already subscribed to the channel
    const isAlreadySubscribed = channel.subscribers.some(
      (sub) => sub.userId.toString() === subscriberId
    );

    if (isAlreadySubscribed) {
      return NextResponse.json(
        { error: "User is already subscribed to this channel" },
        { status: 400 }
      );
    }

    // Check if the channel is already in the subscriber's subscribedChannels list
    const isChannelAlreadyInSubscriberList = subscriber.subscribedChannels.some(
      (chan) => chan.userId.toString() === channelId
    );

    if (isChannelAlreadyInSubscriberList) {
      return NextResponse.json(
        { error: "Channel is already in the subscriber's list" },
        { status: 400 }
      );
    }

    // Add the subscriber to the channel's subscribers list
    channel.subscribers.push({
      userId: subscriber._id,
      username: subscriber.username,
    });

    // Add the channel to the subscriber's subscribedChannels list
    subscriber.subscribedChannels.push({
      userId: channel._id,
      username: channel.username,
    });

    // Save both the subscriber and channel
    await channel.save();
    await subscriber.save();

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error subscribing" },
      { status: 500 }
    );
  }
}