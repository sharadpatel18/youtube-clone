"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Image from "next/image";
import { MyContext } from "@/context/MyContext";

const PlaylistForm = () => {
    const {user} = useContext(MyContext);
  const [videos, setVideos] = useState([]); // All videos
  const [selectedVideos, setSelectedVideos] = useState([]); // Selected videos for playlist
  const [title, setTitle] = useState(""); // Playlist title
  const [isPublic, setIsPublic] = useState(false); // Public/private status
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch all videos
  useEffect(() => {
    axios
      .get("/api/video-backend/getVideo")
      .then((res) => {
        if (res.data) {
          console.log(res.data.video);
          setVideos(res.data.videos);
          setMessage({ type: "success", text: "Videos loaded successfully!" });
        } else {
          setMessage({
            type: "error",
            text: res.data.message || "Failed to load videos.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          type: "error",
          text: "An error occurred while fetching videos.",
        });
      });
  }, []);

  // Toggle video selection
  const toggleVideoSelection = (video) => {
    const isSelected = selectedVideos.includes(video._id);

    if (!isSelected) {
      setSelectedVideos([...selectedVideos, video._id]);
    } else {
      setSelectedVideos(selectedVideos.filter((id) => id !== video._id));
    }
  };
  

  // Submit the playlist
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (!title || selectedVideos.length === 0) {
      alert("Please enter a title and select at least one video.");
      return;
    }
   
    try {
      const res = await axios.post("/api/playlist-backend/addPlayList", {
        userId: user.id,
        username: user.name,
        title,
        playList: selectedVideos,
        isPublic,
      });
      console.log(res.data);
      
      alert("Playlist created successfully!");
      setTitle("");
      setSelectedVideos([]);
      setIsPublic(false);
    } catch (error) {
      console.error("Error creating playlist", error);
    }
  };

  return (
    <div className="container mx-auto p-5 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-red-500">Create Playlist</h2>

      {/* Video Selection Section */}
      <div className="border border-gray-700 p-4 mb-4 rounded-lg">
        <h3 className="text-lg font-bold mb-3">Select Videos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <div
              key={video._id}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-transform transform hover:scale-105 ${
                selectedVideos.find((v) => v === video._id)
                  ? "border-2 border-red-500"
                  : "border border-gray-700"
              }`}
              onClick={() => toggleVideoSelection(video)}
            >
              <Image
                src={video.thumbnail}
                width={320}
                height={180}
                alt={video.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-center font-semibold mt-2 px-2">{video.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Playlist Details */}
      <form
        onSubmit={handleSubmit}
        className="border border-gray-700 p-4 rounded-lg bg-gray-900"
      >
        <h3 className="text-lg font-bold mb-3">Playlist Details</h3>

        <label className="block mb-3">
          <span className="font-semibold">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-600 p-2 w-full rounded bg-black text-white focus:border-red-500"
            placeholder="Enter playlist title"
          />
        </label>

        <label className="flex items-center mt-3">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
            className="mr-2"
          />
          <span className="text-gray-300">Make playlist public</span>
        </label>

        <button
          type="submit"
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full transition-all"
        >
          Create Playlist
        </button>
      </form>
    </div>
  );
};

export default PlaylistForm;
