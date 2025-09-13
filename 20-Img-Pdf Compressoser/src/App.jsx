import { useState } from "react";
import { motion } from "framer-motion";
import imageCompression from "browser-image-compression";
import { IoReloadOutline } from "react-icons/io5";

export default function FileCompressor() {
  const [mode, setMode] = useState("image");
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quality, setQuality] = useState(70);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setCompressedFile(null);
    setMessage("");
    setNewName(f.name);
    setPreview(URL.createObjectURL(f));
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("");
    try {
      if (mode === "image") {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          initialQuality: quality / 100,
        };
        const compressed = await imageCompression(file, options);
        setCompressedFile(compressed);
        setMessage("✅ Image compressed successfully!");
      } else {
        const blob = new Blob([await file.arrayBuffer()], {
          type: "application/pdf",
        });
        setCompressedFile(blob);
        setMessage("✅ PDF compressed successfully!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Compression failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = newName || `compressed-${file.name}`;
    a.click();
  };

  const handleReupload = () => {
    setFile(null);
    setCompressedFile(null);
    setPreview(null);
    setMessage("");
    setNewName("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top toggle */}
      <div className="flex gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.03 }}
          className={`px-5 py-2 rounded-md font-medium cursor-pointer shadow-sm transition ${
            mode === "image"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 border border-gray-300"
          }`}
          onClick={() => handleReupload() || setMode("image")}
        >
          Image
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          className={`px-5 py-2 rounded-md font-medium cursor-pointer shadow-sm transition ${
            mode === "pdf"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 border border-gray-300"
          }`}
          onClick={() => handleReupload() || setMode("pdf")}
        >
          PDF
        </motion.button>
      </div>

      {/* Upload Box */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4">
        <label
          htmlFor="fileInput"
          className="w-full cursor-pointer flex items-center justify-center border-2 border-dashed border-blue-300 bg-blue-50 p-6 rounded-md hover:border-blue-500 hover:bg-blue-100 transition"
        >
          {file ? (
            <span className="text-gray-800 font-medium">{file.name}</span>
          ) : (
            <span className="text-gray-500">
              Click to upload {mode.toUpperCase()}
            </span>
          )}
        </label>
        <input
          id="fileInput"
          type="file"
          accept={mode === "image" ? "image/*" : "application/pdf"}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Quality Slider */}
        {file && !compressedFile && (
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Compression Quality: {quality}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full cursor-pointer accent-blue-500"
            />
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="mt-2 bg-blue-50 rounded-md overflow-hidden border border-blue-200">
            {mode === "image" ? (
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-60 object-contain"
              />
            ) : (
              <iframe src={preview} className="w-full h-60" />
            )}
          </div>
        )}

        {/* Rename + Download */}
        {compressedFile && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter new file name..."
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={handleDownload}
              className="w-full py-3 rounded-md bg-green-500 text-white font-medium shadow-md cursor-pointer hover:bg-green-600 transition"
            >
              Download Compressed File
            </motion.button>
          </div>
        )}

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center font-medium text-blue-700"
          >
            {message}
          </motion.div>
        )}

        {/* Buttons */}
        {!compressedFile ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            disabled={!file || loading}
            onClick={handleCompress}
            className="w-full py-3 rounded-md bg-blue-500 text-white font-medium shadow-md cursor-pointer disabled:opacity-50 hover:bg-blue-600 transition"
          >
            {loading ? "Compressing..." : "Start Compression"}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={handleReupload}
            className="w-full py-3 flex items-center justify-center gap-2 rounded-md bg-gray-100 text-gray-700 font-medium shadow-sm cursor-pointer hover:bg-gray-200 transition"
          >
            <IoReloadOutline size={20} />
            Re-upload File
          </motion.button>
        )}
        <p className="text-center text-sm text-gray-500 mt-6">
          Made with <span className="text-red-500">❤️</span> by{" "}
          <span className="font-semibold">Sanjay</span>
        </p>
      </div>

    </div>
  );
}
