"use client";

import { useContext, useState } from "react";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { MyContext } from "@/context/MyContext";
import Link from "next/link";

export default function Login() {

    const {setIsToken} = useContext(MyContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth-backend/login", formData);
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      setIsToken(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] text-white">
      <div className="w-full max-w-md bg-[#181818] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Log In</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="flex items-center bg-[#282828] px-3 py-2 rounded-md">
            <Mail className="w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent px-3 py-1 focus:outline-none text-white"
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center bg-[#282828] px-3 py-2 rounded-md">
            <Lock className="w-5 h-5 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-transparent px-3 py-1 focus:outline-none text-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-md font-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-red-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
