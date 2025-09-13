import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";

function App() {
  const [text, setText] = useState("https://example.com");
  const [generated, setGenerated] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const generateQR = () => {
    setGenerated(true);
    setShowQR(false);

    // Add 1 second delay before showing QR
    setTimeout(() => {
      setShowQR(true);
    }, 500);
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-gen");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-xl border border-green-300"
      >
        <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">
          QR Code Generator
        </h1>
        <p className="text-center text-green-600 mb-8">
          Enter your text or URL and generate a QR code instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <label className="block text-green-800 text-sm font-medium mb-1">
              Enter Text / URL
            </label>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setGenerated(false); // reset QR when input changes
                setShowQR(false);
              }}
              rows="4"
              className="w-full rounded-lg p-3 bg-green-50 border border-green-300 text-green-900 placeholder:text-green-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="https://example.com"
            />

            {/* Link Preview */}
            <div className="mt-4">
              <label className="block text-green-800 text-sm font-medium mb-1">
                Link Preview
              </label>
              <a
                href={text}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-words"
              >
                {text}
              </a>
            </div>
          </div>

          {/* QR Code Area */}
          <div className="flex flex-col items-center justify-center gap-4">
            {!generated ? (
              <button
                onClick={generateQR}
                className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition-all text-white font-semibold shadow-lg cursor-pointer"
              >
                Generate QR Code
              </button>
            ) : (
              <AnimatePresence>
                {showQR && (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-green-200">
                      <QRCodeCanvas
                        id="qr-gen"
                        value={text}
                        size={200}
                        includeMargin
                      />
                    </div>

                    <button
                      onClick={downloadQR}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all text-white font-medium shadow-lg cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        <p className="text-center text-green-700 text-sm pt-6">
          Made with ❤️ by Sanjay
        </p>
      </motion.div>
    </div>
  );
}

export default App;
