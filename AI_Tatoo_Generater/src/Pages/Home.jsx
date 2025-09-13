import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home({ setActiveTab }) {
  return (
    <div className="flex justify-center items-center sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center w-full max-w-[600px] bg-transparent border border-gray-300 rounded-2xl shadow-lg shadow-gray-400/50 p-6 sm:p-10"
      >
        {/* Title */}
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900"
        >
          Welcome to <span className="text-gray-600">AI Tattoo Studio</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-gray-500 mt-3 text-sm sm:text-base md:text-lg leading-relaxed"
        >
          Create unique, timeless tattoo designs in a modern black & white style,
          powered by AI.
        </motion.p>

        {/* Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 sm:mt-8"
        >
          <Link
            onClick={() => setActiveTab("Generate")}
            to="/generate"
            className="bg-black cursor-pointer text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-md shadow-gray-400 hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base"
          >
            Get Started
          </Link>
        </motion.div>

        {/* --- Preview Section --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8 p-6 rounded-xl border border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100 shadow-inner"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🖋️</span>
            <p className="text-gray-700 font-medium">
              Your AI-Designed tattoo will look like this
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Made with <span className="text-red-500">❤️</span> by{" "}
          <span className="font-semibold">Sanjay</span>
        </p>
      </motion.div>
    </div>
  );
}

export default Home;
