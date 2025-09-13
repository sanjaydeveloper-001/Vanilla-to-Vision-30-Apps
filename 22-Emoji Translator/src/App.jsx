import { useState } from "react";
import { motion } from "framer-motion";
import { FaCopy } from "react-icons/fa";
import emoji from "emoji-dictionary";

export default function EmojiTranslator() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");

  const handleTranslate = () => {
    const words = text.split(" ");
    const translated = words
      .map((word) => emoji.getUnicode(word.toLowerCase()) || word)
      .join(" ");
    setTranslation(translated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translation);
    alert("Copied to clipboard! ✅");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-sky-100 via-sky-200 to-sky-400 p-6">
      <motion.h1
        className="text-4xl font-extrabold text-gray-800 mb-8 tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Emoji Translator
      </motion.h1>

      <input
        type="text"
        className="w-full max-w-lg p-4 rounded-2xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 text-lg bg-white"
        placeholder="Type something... (e.g. I love Pizza)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleTranslate()}
      />

      <button
        onClick={handleTranslate}
        className="mt-6 px-8 py-3 bg-sky-500 text-white font-semibold rounded-xl shadow-md hover:bg-sky-600 transition"
      >
        Translate
      </button>

      {translation && (
        <motion.div
          className="mt-8 p-6 bg-white rounded-2xl shadow-lg w-full max-w-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-3xl font-medium text-gray-700 mb-4">
            {translation}
          </p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 mx-auto transition"
          >
            <FaCopy /> Copy Result
          </button>
        </motion.div>
      )}

      <p className="text-center text-sm text-gray-500 mt-6">
        Made with <span className="text-red-500">❤️</span> by{" "}
        <span className="font-semibold">Sanjay</span>
      </p>
    </div>
  );
}
