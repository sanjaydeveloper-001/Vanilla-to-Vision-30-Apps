import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";

export default function App() {
  const [note, setNote] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("notes");
    if (stored) setSavedNotes(JSON.parse(stored));
  }, []);

  // Save to localStorage whenever savedNotes changes
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(savedNotes));
  }, [savedNotes]);

  // Better (still simple) summarizer that picks the first 1-2 sentences
  function summarizeText(text) {
    if (!text || !text.trim()) return "";
    // match sentences (keeps punctuation)
    const matches = text.match(/[^.!?]+[.!?]*/g) || [];
    const sentences = matches.map((s) => s.trim()).filter(Boolean);
    return sentences.slice(0, 2).join(" ") + (sentences.length > 2 ? "..." : "");
  }

  // Better tags extractor: excludes stop words, uses words >=4 chars, returns top 3
  function extractTags(text) {
    if (!text || !text.trim()) return [];
    const stopWords = new Set([
      "the","is","in","at","of","a","by","an","to","and","on","for","with","this","that",
      "it","are","was","were","be","as","from","or","which","you","your","has","have","but",
      "not","they","their","will","can","we","i","my","so","if","about","into","also","these"
    ]);

    // only alphabetical words of length >=4
    const words = (text.toLowerCase().match(/\b[a-z]{4,}\b/g) || []);
    const freq = {};
    words.forEach((w) => {
      if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
    });

    const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
    return sorted.slice(0, 3);
  }

  const handleSummarize = () => {
    const s = summarizeText(note);
    const t = extractTags(note);
    setSummary(s);
    setTags(t);
  };

  const handleSave = () => {
    if (!note.trim()) return;
    // if user didn't summarize, auto-generate summary/tags so saved note is consistent
    const finalSummary = summary?.trim() ? summary : summarizeText(note);
    const finalTags = tags.length ? tags : extractTags(note);

    const newNote = {
      id: Date.now(),
      text: note,
      summary: finalSummary,
      tags: finalTags,
    };

    setSavedNotes([newNote, ...savedNotes]);
    setNote("");
    setSummary("");
    setTags([]);
  };

  const handleDelete = (id) => {
    const updated = savedNotes.filter((n) => n.id !== id);
    setSavedNotes(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-green-300 p-6 flex flex-col items-center">
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl md:text-4xl font-bold text-slate-800 mb-6"
      >
        Quick Notes
      </motion.h1>

      {/* Input Section */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-4 md:p-6"
      >
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type or paste your note here..."
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none min-h-[120px]"
        />

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSummarize}
            className="flex-1 bg-green-600 text-white font-medium py-2 rounded-xl hover:bg-green-700 transition cursor-pointer"
          >
            Summarize
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-xl hover:bg-blue-700 transition cursor-pointer"
          >
            Save Note
          </motion.button>
        </div>

        {/* Summary + Tags */}
        {summary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-green-50 border rounded-xl p-3"
          >
            <h2 className="font-semibold text-green-700">Summary:</h2>
            <p className="text-gray-700">{summary}</p>

            <div className="mt-2 flex gap-2 flex-wrap">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Saved Notes */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-3xl mt-8"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Saved Notes 📝</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {savedNotes.length === 0 && (
            <p className="text-gray-600 col-span-full">No notes saved yet.</p>
          )}

          {savedNotes.map((n) => (
            <motion.div
              key={n.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white shadow-lg rounded-2xl p-4 flex flex-col justify-between"
            >
              <p className="text-gray-800 mb-3 flex-1 break-words">
                {n.summary || n.text}
              </p>

              <div className="flex justify-between items-center mt-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {n.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Delete button with icon */}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="ml-2 p-2 rounded-full bg-red-100 hover:bg-red-200 transition cursor-pointer"
                  title="Delete note"
                  aria-label="Delete note"
                >
                  <FaTrash size={16} className="text-red-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
