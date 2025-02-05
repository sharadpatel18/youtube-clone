"use client";

import { MyContext } from "@/context/MyContext";
import Axios from "axios";
import React, { useState , useRef, useContext } from "react";
import { useRouter } from "next/navigation";

const Recorder = () => {
  const router = useRouter();
  const { user , setVideoLink } = useContext(MyContext);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [message , setMessage] = useState('');
  const mediaRecorderRef = useRef(null);
  const videoElementRef = useRef(null);
  const videoBlobRef = useRef(null);
  const startRecording = async () => {
    try {
      // Ask for both video and audio streams
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      // Combine video and screen (if needed)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
  
      const combinedStream = new MediaStream([
        ...videoStream.getTracks(),
        ...screenStream.getTracks(),
      ]);
  
      // Set up MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: "video/webm" });
  
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };
  
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
        videoBlobRef.current = URL.createObjectURL(blob);
        setIsRecording(false);
        videoElementRef.current.srcObject = null;
      };
  
      mediaRecorderRef.current.start();
      setIsRecording(true);
      videoElementRef.current.srcObject = combinedStream;
    } catch (error) {
      // Catch specific errors to provide more helpful feedback
      if (error.name === "NotAllowedError") {
        console.error("Permission denied. Please allow access to the camera and microphone.");
        setMessage("Permission denied. Please allow access to the camera.");
      } else if (error.name === "AbortError") {
        console.error("Timeout occurred while starting the video source.");
        setMessage("Timeout occurred while starting the video source. Please try again.");
      } else {
        console.error("Error starting the recording:", error);
        setMessage("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const startScreenRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const combinedStream = new MediaStream([...screenStream.getTracks(), ...audioStream.getTracks()]);

      mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: "video/webm" });

      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
        videoBlobRef.current = URL.createObjectURL(blob);
        setIsScreenRecording(false);
        videoElementRef.current.srcObject = null;
      };

      mediaRecorderRef.current.start();
      setIsScreenRecording(true);
      videoElementRef.current.srcObject = combinedStream;
    } catch (error) {
      console.error("Error starting the recording:", error);
    }
  };

  const stopScreenRecording = async () => {
    mediaRecorderRef.current.stop();
    setIsScreenRecording(false);
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const handleDownload = async () => {
    const url = URL.createObjectURL(recordedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recording.webm";
    link.click();
  };

  const handleAddToDatabase = async () => {
    if (recordedBlob) {
    
        const base64 = await convertBlobToBase64(recordedBlob);
        console.log({ video: base64, userId: user.userId });
        setVideoLink({
          video: base64,
          userId: user.userId,
        })
        router.push("/form");
        // const response = await Axios.post(`/api/add-recording`, {
        //   video: base64,
        //   userId: user.userId,
        // });

        // console.log(response.data);
        // setMessage(response.data.message);
    } else {
      alert("Please record a video first");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 bg-gray-900 h-full py-10 text-white">
      <div className="flex flex-col items-center space-y-6 w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600">YouTube Recorder</h1>

        {/* Video Preview */}
        <div className="relative w-full max-w-lg">
          <video
            ref={videoElementRef}
            controls
            autoPlay
            muted
            className="w-full rounded-lg shadow-lg"
            src={recordedBlob ? URL.createObjectURL(recordedBlob) : undefined}
          />
          {isRecording || isScreenRecording ? (
            <div className="absolute inset-0 flex justify-center items-center bg-black opacity-50 rounded-lg">
              <span className="text-3xl text-white font-bold">Recording...</span>
            </div>
          ) : null}
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-6">
          <button
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all ${
              isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          <button
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all ${
              isScreenRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
            onClick={isScreenRecording ? stopScreenRecording : startScreenRecording}
          >
            {isScreenRecording ? "Stop Screen Recording" : "Start Screen Recording"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-6 mt-4">
          <button
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all bg-gray-700 hover:bg-gray-800 ${
              !recordedBlob ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleDownload}
            disabled={!recordedBlob}
          >
            Download
          </button>
          <button
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all bg-gray-700 hover:bg-gray-800 ${
              !recordedBlob ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleAddToDatabase}
            disabled={!recordedBlob}
          >
            Save to Database
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mt-4 text-center text-lg font-semibold ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recorder;
