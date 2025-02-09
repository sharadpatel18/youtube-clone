"use client";

import { MyContext } from "@/context/MyContext";
import Axios from "axios";
import React, { useState, useRef, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload } from 'lucide-react';

const Recorder = () => {
  const router = useRouter();
  const { user, setVideoLink } = useContext(MyContext);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [message, setMessage] = useState('');
  const mediaRecorderRef = useRef(null);
  const videoElementRef = useRef(null);
  const videoBlobRef = useRef(null);

  useEffect(() => {
    return () => {
      if (videoBlobRef.current) {
        URL.revokeObjectURL(videoBlobRef.current);
      }
    };
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setRecordedBlob(new Blob([file], { type: file.type })); // Ensure it's a Blob
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setMessage("Error reading file. Please try again.");
      };
    }
  };

  const startRecording = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

      const combinedStream = new MediaStream([...videoStream.getTracks(), ...screenStream.getTracks()]);

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
        combinedStream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      videoElementRef.current.srcObject = combinedStream;
    } catch (error) {
      console.error("Error starting recording:", error);
      setMessage(error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const startScreenRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
        combinedStream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsScreenRecording(true);
      videoElementRef.current.srcObject = combinedStream;
    } catch (error) {
      console.error("Error starting screen recording:", error);
      setMessage(error.message);
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const handleDownload = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "recording.webm";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleAddToDatabase = async () => {
    if (recordedBlob) {
      try {
        const base64 = await convertBlobToBase64(recordedBlob);
        setVideoLink({ video: base64, userId: user.userId });
        router.push("/form");
      } catch (error) {
        console.error("Error converting blob to base64:", error);
        setMessage("Error saving video. Please try again.");
      }
    } else {
      setMessage("Please record a video first.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 bg-gray-900 h-full py-10 text-white">
      <div className="flex flex-col items-center space-y-6 w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600">YouTube Recorder</h1>

        <div className="relative w-full max-w-lg">
          <video
            ref={videoElementRef}
            controls
            autoPlay
            muted
            className="w-full rounded-lg shadow-lg"
            src={recordedBlob ? URL.createObjectURL(recordedBlob) : undefined}
          />
          {(isRecording || isScreenRecording) && (
            <div className="absolute inset-0 flex justify-center items-center bg-black opacity-50 rounded-lg">
              <span className="text-3xl text-white font-bold">Recording...</span>
            </div>
          )}
        </div>

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

        <div className="flex items-center my-9 space-x-2">
          <label className="flex items-center justify-center w-full bg-[#282828] p-2 rounded cursor-pointer">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="ml-2 text-gray-400">Upload your video here</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

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

       

        {message && (
          <div className={`mt-4 text-center text-lg font-semibold ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recorder;