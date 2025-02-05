"use client";

import { MyContext } from "@/context/MyContext";
import { useContext, useState } from "react";
import Axios from "axios";

export default function Form() {
  const { user ,videoLink} = useContext(MyContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  console.log(user);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
          const response = await Axios.post(`/api/video-backend/saveVideo`, {
          videoUrl: videoLink.video,
          userId: user.userId,
          title: title,
          description: description,
          userId: user.id,
          username: user.name,
          profilePicture: user.profilePicture
        });

        console.log(response.data);
        //setMessage(response.data.message);
    console.log({ title, description });
  };
  console.log(videoLink);
  
 if (videoLink) {
  return (
    <div className="w-full h-screen flex justify-center items-center mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg relative">
      <form
        onSubmit={handleSubmit}
        className="w-1/2  flex flex-col space-y-6 p-8 bg-gray-800 text-white rounded-md shadow-md"
      >
        {/* Video Preview Section */}
        <div className="flex flex-col space-y-4">
          <div className="w-full h-64 bg-gray-700 rounded-md overflow-hidden">
            <video
              src={videoLink.video}
              controls
              className="w-full h-full object-cover"
            />
          </div>
          <label htmlFor="title" className="text-lg font-semibold">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter video title"
          />
        </div>

        {/* Description Section */}
        <div className="flex flex-col space-y-4">
          <label htmlFor="description" className="text-lg font-semibold">
            Description
          </label>
          <textarea
            id="description"
            className="p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter video description"
            rows="5"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold mt-6 transition-all"
        >
          Submit
        </button>
      </form>
    </div>
  );
 }else{
  <h1>Loading...`</h1>
 }
}
