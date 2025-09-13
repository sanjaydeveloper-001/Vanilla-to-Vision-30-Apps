import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Generate() {
  const [Idea, setIdea] = useState("");
  const [sitemap, setSitemap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (Idea.trim() === "") {
        alert("Please enter an idea before generating a sitemap.");
        return;
    }

    setSitemap(null);
    setLoading(true);
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku:beta",
        messages: [
          {
            role: "user",
            content: `Generate a structured sitemap in clean JSON format for:${Idea}.
            Only return raw JSON without any explanation or code block. No markdown. Just plain JSON.
            Example:
            [
              "Home",
              "Features",
              { "Dashboard": ["Profile", "Settings"] }
            ]`,
          },
        ],
      }),
    });

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();

    try {
      const parsed = JSON.parse(text);
      setSitemap(parsed);
    } catch (err) {
      console.error("Invalid JSON:", err, text);
      setSitemap(null);
    }
    finally{
        setLoading(false);
    }
  };

  // Recursive renderer for sitemap
  const renderTree = (node) => {
    if (typeof node === "string") {
      return (
        <li key={node.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg shadow-sm mb-2">
          {node}
        </li>
      );
    }
    if (typeof node === "object") {
      return Object.entries(node).map(([key, value], idx) => (
        <li key={idx} className="mb-3">
          <div className="font-semibold text-gray-800 bg-gray-200 px-3 py-1 rounded-lg shadow-sm inline-block mb-2">
            {key}
          </div>
          <ul className="ml-6 border-l-2 border-gray-300 pl-4 space-y-2">
            {value.map((child, i) => (
              <div key={i}>{renderTree(child)}</div>
            ))}
          </ul>
        </li>
      ));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-gray-900 px-6 pt-10">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-bold mb-6 text-gray-800"
      >
        🧠 Describe Your App
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg flex flex-col items-center"
      >
        <input
          type="text"
          value={Idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. A book website"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 shadow-sm"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerate}
          className="bg-white shadow-md hover:shadow-lg px-6 py-3 rounded-xl font-semibold text-gray-800 transition duration-300"
        >
          { loading ? "Generating..." : "Generate Sitemap" }
        </motion.button>

        {sitemap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 bg-white shadow-md p-6 rounded-xl w-full"
          >
            <p className="text-lg font-medium text-gray-800 mb-4">
              📦 Generated Sitemap
            </p>
            <ul className="space-y-2">{sitemap.map((node, idx) => renderTree(node, idx))}</ul>
          </motion.div>
        )}

        <Link to="/" className="my-6 text-sm text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

export default Generate;
