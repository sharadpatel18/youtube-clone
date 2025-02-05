"use client";

import { useContext, useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import Link from "next/link";
import { MyContext } from "@/context/MyContext";
import Image from "next/image";

export default function Navbar() {
  const { user } = useContext(MyContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchTerm}`);
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-black text-white shadow-md">
      {/* Left - Logo & Menu */}
      <div className="flex items-center space-x-4">
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6 text-white" />
        </button>
        <Link href="/" className="text-2xl font-bold text-red-600">
          YouTube
        </Link>
      </div>

      {/* Middle - Search Bar */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex flex-1 max-w-lg items-center bg-gray-800 rounded-lg overflow-hidden"
      >
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </form>

      {/* Right - Notifications & Profile */}
      <div className="flex items-center space-x-4">
        <Link href='/video' className="">
            Publish your Video   
        </Link>
        <button>
          <Bell className="w-6 h-6 text-white" />
        </button>
       
        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {/* Display user's profile picture or default UserCircle */}
            {user && user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt="User Profile"
                width={30}
                height={30}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                {/* Default User Circle Icon */}
                <span className="text-xl text-white">U</span>
              </div>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Profile
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                About 
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Contact us
              </Link>
              {user ? (
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 hover:bg-gray-700 text-red-600"
                >
                  Logout
                </Link>
              ) : (
                <div>
                  <Link
                    href="/auth/signup"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Signup
                  </Link>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
