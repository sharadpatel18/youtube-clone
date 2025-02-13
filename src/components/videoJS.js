"use client";

import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming"; // Enable HLS support

export const VideoJS = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize the player if it doesn't exist
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      // Initialize the player with HLS support
      playerRef.current = videojs(videoElement, options, () => {
        videojs.log("Player is ready");
        onReady && onReady(playerRef.current);
      });

      // Listen for progress events to track buffered chunks
      playerRef.current.on("progress", () => {
        console.log("Progress event triggered");
        const player = playerRef.current;
        if (!player) return;

        const buffered = player.buffered();
        if (buffered.length > 0) {
          const currentTime = player.currentTime();
          const bufferedEnd = buffered.end(buffered.length-1);
          console.log(videoRef.current);
          
          console.log(`Buffered Time: ${bufferedEnd}`);
          console.log(`Current Time: ${currentTime}`);

          // Display buffered chunks
          for (let i = 0; i < buffered.length; i++) {
            console.log(
              `Buffered Chunk ${i + 1}: ${buffered.start(i)} to ${buffered.end(i)}`
            );
          }
        }
      });
    } else {
      // Update the player if options change
      playerRef.current.autoplay(options.autoplay);
      playerRef.current.src(options.sources);
    }

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;