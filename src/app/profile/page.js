"use client";

import { useContext } from "react";
import { MyContext } from "@/context/MyContext";
import Image from "next/image";
import Link from "next/link";

export default function Profile() {
  const { user } = useContext(MyContext);

  if (user) {
    return (
      <div className="bg-black text-white min-h-screen">
        {/* Profile Header Section */}
        <div className="relative w-full h-64">
          {user?.coverPicture && (
            <Image
              src={user?.coverPicture}
              alt="Cover Image"
              layout="fill"
              objectFit="cover"
              className="rounded-b-lg"
            />
          )}
        </div>

        {/* Profile Information */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between space-x-8">
            {/* Profile Picture */}
            <div className="relative w-28 h-28 border-4 border-red-600 rounded-full overflow-hidden">
              <Image
                src={user?.profilePicture || "/path/to/default-profile-pic.jpg"}
                alt="Profile Picture"
                width={120}
                height={120}
                className="object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{user.name}</h1>
              <p className="text-gray-400 text-lg mt-2">
                Subscribers: {user.subscribers.length}
              </p>
              <p className="text-gray-500 text-sm mt-2">{user?.email}</p>
              {/* Bio Section */}
              <p className="text-gray-300 mt-4">
                {user?.bio || "No bio available."}
              </p>
            </div>

            {/* Edit Button */}
            <div className="flex-shrink-0">
              <Link href="/profile/edit">
                <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg">
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-black py-3">
          <div className="max-w-7xl mx-auto flex justify-center space-x-8 text-white">
            <Link href="/profile/videos">
              <span className="text-lg font-semibold hover:text-red-600 cursor-pointer transition-colors duration-300 px-4 py-2 rounded-md border-b-4 border-transparent hover:border-red-600">
                Videos
              </span>
            </Link>
            <Link href="/profile/playlists">
              <span className="text-lg font-semibold hover:text-red-600 cursor-pointer transition-colors duration-300 px-4 py-2 rounded-md border-b-4 border-transparent hover:border-red-600">
                Playlists
              </span>
            </Link>
            <Link href="/profile/about">
              <span className="text-lg font-semibold hover:text-red-600 cursor-pointer transition-colors duration-300 px-4 py-2 rounded-md border-b-4 border-transparent hover:border-red-600">
                About
              </span>
            </Link>
          </div>
        </div>

        {/* User Content Section */}
        <div className="max-w-7xl mx-auto py-6 px-6">
          <h2 className="text-2xl font-semibold text-white">Your Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* Example Video Thumbnail */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform">
              <Image
                src={user?.profilePicture} // Replace with actual video thumbnail
                alt="Video Thumbnail"
                width={320}
                height={180}
                objectFit="cover"
              />
              <div className="p-4">
                <h3 className="text-white text-lg font-semibold">
                  Video Title
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  Description of the video...
                </p>
              </div>
            </div>
            {/* Repeat for other video cards */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform">
              <Image
                src={user?.profilePicture} // Replace with actual video thumbnail
                alt="Video Thumbnail"
                width={320}
                height={180}
                objectFit="cover"
              />
              <div className="p-4">
                <h3 className="text-white text-lg font-semibold">
                  Video Title
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  Description of the video...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">You are not logged in.</h1>
      </div>
    );
  }
}
