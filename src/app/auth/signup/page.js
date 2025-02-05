"use client";

import { useState } from "react";
import axios from "axios";
import { Upload, ImagePlus } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profilePicture: "",
    coverPicture: "",
    isAdmin: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload (dummy function, replace with actual logic)
  const handleFileUpload = (e) => {
    let render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
        setFormData({ ...formData, profilePicture: render.result });
    };
    render.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth-backend/signup", formData);
      console.log(res.data);
      alert("Signup successful!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] text-white">
      <div className="w-full max-w-md bg-[#181818] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 bg-[#282828] rounded outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 bg-[#282828] rounded outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 bg-[#282828] rounded outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          {/* Profile Picture Upload */}
          <label className="block text-gray-300">Profile Picture</label>
          <div className="flex items-center space-x-2">
            <label className="flex items-center justify-center w-full bg-[#282828] p-2 rounded cursor-pointer">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="ml-2 text-gray-400">Upload</span>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, "profilePicture")}
                className="hidden"
              />
            </label>
          </div>
          {formData.profilePicture && (
            <img
              src={formData.profilePicture}
              alt="Profile Preview"
              className="mt-2 h-16 w-16 object-cover rounded-full"
            />
          )}

          {/* Cover Picture Upload */}
          <label className="block text-gray-300">Cover Picture</label>
          <div className="flex items-center space-x-2">
            <label className="flex items-center justify-center w-full bg-[#282828] p-2 rounded cursor-pointer">
              <ImagePlus className="w-5 h-5 text-gray-400" />
              <span className="ml-2 text-gray-400">Upload</span>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, "coverPicture")}
                className="hidden"
              />
            </label>
          </div>
          {formData.coverPicture && (
            <img
              src={formData.coverPicture}
              alt="Cover Preview"
              className="mt-2 h-24 w-full object-cover rounded-lg"
            />
          )}

          {/* isAdmin Toggle */}
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={(e) =>
                setFormData({ ...formData, isAdmin: e.target.checked })
              }
              className="w-5 h-5"
            />
            <span>Admin Account</span>
          </label>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-red-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
