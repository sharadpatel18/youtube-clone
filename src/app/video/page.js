"use client";

import { useContext } from "react";
import { motion } from "framer-motion";
import Recorder from "./Recorder";
import { MyContext } from "@/context/MyContext";
import { Video, LogIn, Home, Settings } from "lucide-react";

function MyPage() {
  const { user } = useContext(MyContext);

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white">
      <div className="flex flex-grow">
        <motion.main
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center justify-center w-full h-screen p-6"
        >
          {user ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="w-full h-4/5 max-w-3xl bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Start Recording</h2>
              <Recorder />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col items-center text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Sign in to start recording</h2>
              <a
                href="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Login Now
              </a>
            </motion.div>
          )}
        </motion.main>
      </div>
    </div>
  );
}

/* Sidebar Button Component */
// const SidebarButton = ({ icon, label }) => (
//   <motion.button
//     whileHover={{ scale: 1.1, color: "rgb(255, 100, 100)" }}
//     className="flex items-center space-x-2 text-lg font-semibold hover:text-red-500"
//   >
//     {icon}
//     <span>{label}</span>
//   </motion.button>
// );

export default MyPage;
