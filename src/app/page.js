"use client";

import { MyContext } from "@/context/MyContext";
import { useContext, useEffect, useState, useRef } from "react";
import Axios from "axios";
import VideoPlayer from "@/components/videoPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, X } from "lucide-react";
import Image from "next/image";
import VideoJS from '@/components/videoJS'
import videojs from 'video.js';

export default function Home() {
  const { user } = useContext(MyContext);
  const selectedVideoRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Track current video in playlist

  useEffect(() => {
    Axios.get("/api/video-backend/getVideo")
      .then((res) => {
        if (res.data) {
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

    Axios.get("/api/playlist-backend/getAllPlaylist")
      .then((res) => {
        if (res.data) {
          setPlaylists(res.data.playlists); // Store playlists
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const openModal = (video) => {
    setSelectedPlaylist(null); // Reset any playlist selection
    setSelectedVideo(video);
    setIsModalOpen(true);

  };

  const openPlaylist = (playlist) => {
    setSelectedPlaylist(playlist.videos); // Store full playlist
    setSelectedVideo(playlist.videos[0]); // Start with the first video in the playlist
    setCurrentVideoIndex(0); // Reset video index
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setSelectedPlaylist(null); // Reset playlist selection
    setIsModalOpen(false);
  };

  const handleNextVideo = () => {
    if (selectedPlaylist && currentVideoIndex < selectedPlaylist.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      setSelectedVideo(selectedPlaylist[nextIndex]);
    }
  };

  const handlePreviousVideo = () => {
    if (selectedPlaylist && currentVideoIndex > 0) {
      const prevIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(prevIndex);
      setSelectedVideo(selectedPlaylist[prevIndex]);
    }
  };

  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    preload: "auto", // Preloads the video to enable buffering
    playbackRates: [0.5, 1, 1.5, 2], // Speed options
    sources: [{
      src: selectedVideo?.videoUrl || "/path-to-play.mp4",
      type: 'video/mp4'
    }]
  };


  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  if (user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center py-8 px-4">
        {/* Page Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8 text-center text-red-500"
        >
          Your Videos
        </motion.h1>

        {/* Message Box */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0 }}
            className={`p-4 rounded-md text-center ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Video Grid */}
        <div className="w-full p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.length > 0 ? (
            videos.map((video) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg cursor-pointer my-5"
                onClick={() => openModal(video)}
              >
                {/* Video Thumbnail */}
                <div className="relative w-full h-48">
                  <Image
                    src={video.thumbnail || "/no-thumbnail.png"} // Ensure this path is correct
                    alt="Thumbnail"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                    <PlayCircle className="text-white text-5xl" />
                  </div>
                </div>

                {/* Video Details */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white truncate">
                    {video.title || "Untitled Video"}
                  </h3>
                  <div className="flex justify-between text-gray-400 text-sm mt-2">
                    <span>{video.views?.length} views</span>
                    <span>{video?.username}</span>
                    <span>
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="col-span-full flex justify-center items-center"
            >
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-white"></div>
            </motion.div>
          )}
        </div>

        {/* Playlist Grid */}
        <div className="w-full p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <motion.div
                key={playlist._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg cursor-pointer my-5"
                onClick={() => openPlaylist(playlist)}
              >
                {/* Playlist Thumbnail */}
                <div className="relative w-full h-48">
                  <Image
                    src={playlist.thumbnail || "/no-thumbnail.png"} // Use the first video thumbnail or a default image
                    alt="Playlist Thumbnail"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                  {/* Overlay Play All */}
                  <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm">
                      <PlayCircle size={20} /> Play All
                    </button>
                  </div>
                </div>

                {/* Playlist Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {playlist.title || "Untitled Playlist"}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">
                    {playlist.description || "No description"}
                  </p>
                  <div className="flex justify-between text-gray-400 text-xs mt-2">
                    <span>{playlist.videos.length} videos</span>
                    <span>{playlist.creator}</span>
                    <span>
                      {new Date(playlist.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="col-span-full flex justify-center items-center"
            >
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-white"></div>
            </motion.div>
          )}
        </div>

        {/* MODAL - Video Player */}
        <AnimatePresence>
          {isModalOpen && selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 px-4"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-4xl"
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-50 text-white text-4xl font-bold"
                >
                  <X />
                </button>
                <VideoPlayer
                  videoUrl={selectedVideo}
                  playlist={selectedPlaylist}
                  currentVideoIndex={currentVideoIndex}
                  onNext={handleNextVideo}
                  onPrevious={handlePreviousVideo}
                />
                  {/* <VideoJS options={videoJsOptions} onReady={handlePlayerReady} /> */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  } else {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8 text-center text-red-500"
        >
          Sign in to view your videos
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="p-4 rounded-md text-center bg-red-500"
        >
          Please sign in to view your videos.
        </motion.div>
      </div>
    );
  }
}