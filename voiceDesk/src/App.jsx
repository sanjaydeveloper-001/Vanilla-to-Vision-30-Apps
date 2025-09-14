import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiMic, FiStopCircle, FiPlay, FiDownload } from "react-icons/fi";

export default function VoiceDesk() {
  const [mode, setMode] = useState("tts");

  // TTS state
  const [text, setText] = useState(
    "Hello! Welcome to VoiceDesk. Type something and press play."
  );
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // STT state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  // History
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("voicedesk_history");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // init voices
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices() || [];
      setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // TTS: play
  function handleSpeak() {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voices[voiceIndex]) u.voice = voices[voiceIndex];
    u.rate = rate;
    u.pitch = pitch;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);

    saveHistory({ type: "tts", text: text.slice(0, 100), date: Date.now() });
  }

  function handleStopSpeak() {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  // STT: init
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const r = new SpeechRecognition();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e) => {
      let interim = "";
      let final = transcript;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          final += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }
      setTranscript(final + interim);
    };
    r.onerror = (ev) => console.error("Recognition error", ev);
    recognitionRef.current = r;
  }, []);

  function startRecording() {
    const r = recognitionRef.current;
    if (!r) {
      alert(
        "Speech Recognition not supported in this browser (Chrome desktop recommended)."
      );
      return;
    }
    setIsRecording(true);
    setTranscript("");
    r.start();
  }
  function stopRecording() {
    const r = recognitionRef.current;
    if (!r) return;
    r.stop();
    setIsRecording(false);
    saveHistory({
      type: "stt",
      text: transcript.slice(0, 200),
      date: Date.now(),
    });
  }

  function copyTranscript() {
    navigator.clipboard.writeText(transcript).then(() => {
      alert("Transcript copied to clipboard");
    });
  }

  function downloadTranscript() {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voicedesk_transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function saveHistory(entry) {
    const h = [entry, ...history].slice(0, 30);
    setHistory(h);
    localStorage.setItem("voicedesk_history", JSON.stringify(h));
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem("voicedesk_history");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4"
        >
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-indigo-700">
              VoiceDesk
            </h1>
            <p className="text-sm text-gray-500">
              Text ↔ Speech converter • Fast, simple & offline-friendly
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-gray-100 rounded-lg p-1 flex items-center border border-gray-300">
              <button
                onClick={() => setMode("tts")}
                className={`px-3 py-1 rounded-md transition ${
                  mode === "tts"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Text → Speech
              </button>
              <button
                onClick={() => setMode("stt")}
                className={`px-3 py-1 rounded-md transition ${
                  mode === "stt"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Speech → Text
              </button>
            </div>
          </div>
        </motion.header>

        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Core panel */}
            <section className="bg-white border border-gray-200 shadow-md rounded-2xl p-6">
              <motion.div layout>
                {mode === "tts" ? (
                  <div>
                    <label className="text-sm font-medium">
                      Enter text to speak
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={8}
                      className="w-full mt-3 p-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-sm">Voice</label>
                        <select
                          value={voiceIndex}
                          onChange={(e) =>
                            setVoiceIndex(Number(e.target.value))
                          }
                          className="w-full mt-2 p-2 rounded-md border border-gray-300 bg-gray-50"
                        >
                          {voices.length === 0 && <option>Default</option>}
                          {voices.map((v, i) => (
                            <option
                              key={i}
                              value={i}
                            >{`${v.name} — ${v.lang}`}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm">Rate</label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full accent-blue-700"
                          />
                        </div>
                        <div>
                          <label className="text-sm">Pitch</label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={pitch}
                            onChange={(e) => setPitch(Number(e.target.value))}
                            className="w-full accent-blue-700"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={handleSpeak}
                          className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white flex items-center justify-center gap-2 hover:bg-emerald-600"
                        >
                          <FiPlay /> Play
                        </button>
                        <button
                          onClick={handleStopSpeak}
                          className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white flex items-center justify-center gap-2 hover:bg-red-600"
                        >
                          <FiStopCircle /> Stop
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium">
                      Live speech transcription
                    </label>
                    <div className="mt-3 p-4 rounded-xl border border-gray-300 bg-gray-50 min-h-[180px]">
                      <div className="whitespace-pre-wrap">
                        {transcript || (
                          <span className="text-gray-400">
                            Press the mic and start speaking — your words will
                            appear here.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="px-4 py-2 rounded-xl bg-rose-500 text-white flex items-center gap-2 hover:bg-rose-600"
                        >
                          <FiMic /> Start
                        </button>
                      ) : (
                        <button
                          onClick={stopRecording}
                          className="px-4 py-2 rounded-xl bg-gray-600 text-white flex items-center gap-2 hover:bg-gray-700"
                        >
                          <FiStopCircle /> Stop
                        </button>
                      )}

                      <button
                        onClick={copyTranscript}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200"
                      >
                        Copy
                      </button>
                      <button
                        onClick={downloadTranscript}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </section>

            {/* Right: History & info */}
            <aside className="space-y-4">
              <motion.div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-indigo-700">History</h3>
                  <button onClick={clearHistory} className="text-xs text-gray-500 hover:text-gray-700">
                    Clear
                  </button>
                </div>

                <div className="mt-3 space-y-3 max-h-72 overflow-auto">
                  {history.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No history yet. Your TTS plays and STT transcripts will
                      appear here.
                    </div>
                  )}
                  {history.map((h, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div className="text-xs text-gray-500">
                        {h.type.toUpperCase()} •{" "}
                        {new Date(h.date).toLocaleString()}
                      </div>
                      <div className="mt-1 font-medium text-sm text-gray-800">{h.text}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6">
                <h3 className="font-semibold text-indigo-700">About</h3>
                <p className="text-sm mt-2 text-gray-600">
                  VoiceDesk bundles Text-to-Speech and Speech-to-Text in one
                  lightweight app. It uses your browser's Web Speech APIs —
                  meaning it can work offline for TTS playback. Transcription
                  requires Chrome or compatible browsers.
                </p>
              </motion.div>
            </aside>
          </div>

          <footer className="mt-8 text-center text-sm text-gray-500">
            Made with ❤️ by Sanjay 
          </footer>
        </motion.main>
      </div>
    </div>
  );
}
