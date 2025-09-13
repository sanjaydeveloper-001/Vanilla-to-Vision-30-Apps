import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-gray-900 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold mb-4 text-center text-gray-800"
      >
        AI Sitemap Builder
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg text-gray-600 mb-8 text-center max-w-xl"
      >
        Turn your app ideas into beautiful sitemaps instantly using AI 🧠
      </motion.p>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/generate"
          className="bg-white shadow-md hover:shadow-lg px-6 py-3 rounded-xl font-semibold text-gray-800 transition duration-300 inline-block"
        >
          🚀 Generate Your Sitemap
        </Link>
      </motion.div>
      <p className="text-center text-sm text-gray-500 mt-6">
          Made with <span className="text-red-500">❤️</span> by{" "}
          <span className="font-semibold">Sanjay</span>
        </p>
    </div>
  );
}

export default Home;
