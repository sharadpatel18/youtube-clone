"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { Play, Pause, Loader2, ThumbsUp, ThumbsDown, Bell } from "lucide-react";
import Image from "next/image";
import { MyContext } from "@/context/MyContext";
import axios from "axios";
import CommentsSection from "./commentSection";

const VideoPlayer = ({ videoUrl, playlist, currentVideoIndex , onPrevious , onNext }) => {
  
  const videoRef = useRef(null);
  const { user } = useContext(MyContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [hasInfiniteDuration, setHasInfiniteDuration] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribedUsers, setSubscribedUsers] = useState([]);
  const [buffered, setBuffered] = useState(0);

  // Current video being played (either from videoUrl or playlist)
  const currentVideo = playlist ? playlist[currentVideoIndex] : videoUrl;

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Update buffered progress
      const updateBuffered = () => {
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const bufferedPercent = (bufferedEnd / video.duration) * 100;
          setBuffered(bufferedPercent);
        }
      };

      // Update playback progress
      const updateProgress = () => {
        setProgress((video.currentTime / video.duration) * 100);
      };

      video.addEventListener("progress", updateBuffered);
      video.addEventListener("timeupdate", updateProgress);

      return () => {
        video.removeEventListener("progress", updateBuffered);
        video.removeEventListener("timeupdate", updateProgress);
      };
    }
  }, []);
  // Handle subscribe
  const handleSubscribe = async () => {
    console.log(user);

    try {
      // Send a request to the backend to subscribe
      const res = await axios.post("/api/video-backend/subscribeHandle", {
        subscriberId: user.id,
        channelId: currentVideo.userId,
      });

      if (res.status === 200) {
        setSubscribed(true);

        const updatedChannel = await axios.get(
          `/api/video-backend/getSubscriber/${currentVideo.userId}`
        );

       if (updatedChannel.data) {
          setSubscribedUsers(updatedChannel.data.subscribers);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const saveData = async () => {
      try {
        const res = await axios.get(
          `/api/video-backend/getSubscriber/${currentVideo.userId}`
        );

        if (res.data) {
          console.log(res.data);
          const data = res.data;
          const findIndex = data.user.subscribers.findIndex((item) => {
            return item.userId === user.id;
          });

          if (findIndex >= 0) {
            setSubscribed(true);
          }
          setSubscribedUsers(data.user.subscribers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    saveData();
  }, [subscribed, currentVideo, user]);

  useEffect(() => {
    const index = currentVideo?.views?.findIndex((item) => {
      return item.userId === user.id;
    });
    console.log(user);

    if (index === -1) {
      currentVideo.views.push({
        userId: user.id,
        username: user.name,
      });
    }

    const findLikeIndex = currentVideo?.likes?.findIndex((item) => {
      return item.userId === user.id;
    });

    if (findLikeIndex >= 0) {
      setLiked(true);
    }
  }, [currentVideo, user]);

  useEffect(() => {
    const saveData = async () => {
      try {
        const res = await axios.patch(
          `/api/video-backend/viewHandle/${currentVideo._id}`,
          { views: currentVideo.views }
        );
      } catch (error) {
        console.log(error);
      }
    };
    saveData();
  }, [currentVideo]);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;

    if (video) {
      const videoDuration = video.duration;
      setDuration(videoDuration);
      if (!isFinite(videoDuration)) {
        setHasInfiniteDuration(true);
      } else {
        setHasInfiniteDuration(false);
      }
      if (!hasInfiniteDuration || video.readyState >= 2) {
        setIsLoading(false);
        setIsVideoLoading;
      }
    }
  }, [hasInfiniteDuration]);

  // Handle video play
  useEffect(() => {
    const video = videoRef.current;
    if (videoLoaded && video) {
      video.currentTime = 0;
      video
        .play()
        .catch((error) => console.error("Error playing video:", error));
      setIsPlaying(true);
    }
  }, [videoLoaded]);

  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (!isFinite(video.duration)) {
        setHasInfiniteDuration(true);
        formatTime(currentTime);
      } else {
        setHasInfiniteDuration(false);
        setVideoLoaded(true);
      }
    }

    if (video && isFinite(video.duration)) {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    }
  }, []);

  // Add event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      handleLoadedMetadata();
      handleTimeUpdate();
      const handleCanPlay = () => {
        if (hasInfiniteDuration) {
          setIsVideoLoading(false);
        }
      };
      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [handleLoadedMetadata, handleTimeUpdate, hasInfiniteDuration]);

  // Toggle play/pause
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video
        .play()
        .catch((error) => console.error("Error playing video:", error));
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Handle seek
  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !isFinite(duration)) return;
    const seekTime = (e.nativeEvent.offsetX / e.target.offsetWidth) * duration;
    video.currentTime = seekTime;
  };

  // Format time
  const formatTime = (time) => {
    if (!isFinite(time)) {
      time = 0;
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle like
  const handleLike = () => {
    setLiked(!liked);

    const findIndex = currentVideo?.likes?.findIndex((item) => {
      return item.userId === user.id;
    });

    if (findIndex === -1) {
      currentVideo.likes.push({
        userId: user.id,
        username: user.name,
      });
    }
    const saveData = async () => {
      try {
        const res = await axios.patch(
          `/api/video-backend/likeHandle/${currentVideo._id}`,
          { likes: currentVideo.likes }
        );
        setLiked(true);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    saveData();
  };

  return (
    <div className="w-full h-screen mx-auto overflow-scroll p-4 bg-gray-900 text-white rounded-lg shadow-lg relative">
      {hasInfiniteDuration && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-150">
          <Loader2 className="animate-spin text-blue-500 mx-2" size={40} />
          <h1 className="text-2xl font-bold text-white mt-4">
            Please wait... video is loading
          </h1>
        </div>
      )}
      <div className="flex items-center gap-3 p-3 border-b border-gray-300">
        <Image
          src={currentVideo.profilePicture}
          alt="Profile Photo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="font-semibold text-lg">{currentVideo.username}</span>
      </div>
      <video
        ref={videoRef}
        src={currentVideo.videoUrl}
        className={`w-full rounded-lg ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onCanPlay={() => setIsLoading(false)}
        preload="metadata"
        autoPlay={hasInfiniteDuration}
        muted={hasInfiniteDuration}
        onEnded={() => onNext()}
      />
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col items-center mt-4">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 border-t">
          <button
            onClick={() => {
              const video = videoRef.current;
              if (video) video.currentTime = Math.max(video.currentTime - 2, 0);
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            -2 sec
          </button>
          <button
            onClick={togglePlayPause}
            className="px-4 py-2 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={() => {
              const video = videoRef.current;
              if (video)
                video.currentTime = Math.min(
                  video.currentTime + 2,
                  video.duration
                );
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            +2 sec
          </button>
          </div>
          <div className="w-full">
          <span className="text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          {!hasInfiniteDuration && (
            <div className="relative h-2 bg-gray-800 mt-2 rounded overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gray-400"
              style={{ width: `${buffered}%` }}
            ></div>
            <div
              className="absolute top-0 left-0 h-full bg-red-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          )}
          </div>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 border-t">
          <div className="flex space-x-4">
            <button
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                liked ? "bg-blue-500 text-white" : "bg-green-500"
              }`}
              onClick={handleLike}
            >
              <ThumbsUp className="w-5 h-5 mr-2" /> {currentVideo?.likes?.length || 0}
            </button>
            <button className="flex items-center px-4 py-2 rounded-md bg-red-500">
              <ThumbsDown className="w-5 h-5 mr-2" />
            </button>
          </div>
          <span>{currentVideo?.views?.length || 0} Views</span>
          <button
            className={`flex justify-center items-center px-4 py-2 rounded-md transition-all ${
              subscribed ? "bg-red-600 text-white" : "bg-red-500"
            }`}
            onClick={handleSubscribe}
          >
            <Bell className="w-5 h-5 mr-2" />{" "}
            {subscribed ? "Subscribed" : "Subscribe"} {subscribedUsers?.length || 0}
          </button>
        </div>
      </div>
      <div>
        <CommentsSection key={currentVideo._id} videoId={currentVideo._id}></CommentsSection>
      </div>
    </div>
  );
};

export default VideoPlayer;