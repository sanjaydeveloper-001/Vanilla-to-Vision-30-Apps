import { useState } from "react";
import InkLoader from "../components/InkLoader"; // your loader

function Generate({setGallery}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [saved , setSaved] = useState(false);

  const handleGenerate = async () => {
    if(!prompt.trim()){
      alert("Please enter a prompt");
      return;
    }
  try {
    setLoading(true);
    console.log("promt: "+prompt);
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5173/",
        "X-Title": "AI Tattoo Generator",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview:free",
        messages: [
          {
            role: "system",
            content:
              "You are an expert tattoo designer. Always follow the user’s instructions carefully and generate a tattoo image.",
          },
          {
            role: "user",
            content: `Tattoo Request:
              1. Create a tattoo design of ${prompt}.
              2. Style: clean, high-contrast, black & white.
              3. Details: line art, shading, no text, no background.
              4. Output: a unique tattoo design.
              Rules: Do NOT place it on skin or body, Show only the tattoo design itself.
              Background: plain white.
              Style: clean, black ink, line art, shading.`
          },
        ],
        modalities: ["image","text"],
      }),
    });

    const text = await resp.text();
    const data = JSON.parse(text);

    if(!text) throw new Error("Empty responce fromm model");
    const img = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if(!img) throw new Error("No image found in response");
    setImage(img);
    
  } catch (err) {
    console.error("❌ Error generating tattoo:", err);
  }
  finally{
    setLoading(false);
  }
};
// 📥 Function to download image
  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "tattoo-design.png"; // filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex justify-center items-center sm:px-4 py-8">
      <div className="w-full max-w-[700px] bg-transparent border border-gray-300 shadow-lg shadow-gray-400/40 rounded-2xl p-5 sm:p-8">
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-gray-900">
          AI <span className="text-gray-600">Tattoo Generator</span>
        </h1>

        <p className="text-center text-gray-500 mt-2 text-sm sm:text-base">
          Type an idea → get a clean, black-ink tattoo design.
        </p>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your tattoo idea..."
            className="w-full flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 outline-none text-sm sm:text-base"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-black w-full sm:w-max text-white px-5 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-md shadow-gray-400 text-sm sm:text-base disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Image / Preview */}
        <div className="mt-8 border border-gray-300 rounded-xl p-6 flex flex-col justify-center items-center min-h-[250px] gap-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <InkLoader />
              <p className="text-gray-500 text-sm">Generating your tattoo...</p>
            </div>
          ) : image ? (
            <>
              <img
                src={image}
                alt="Tattoo Preview"
                className="rounded-lg max-w-[80%] sm:max-w-[60%] shadow-md"
              />
              <div className="flex w-full justify-end gap-2">
                <button
                  onClick={handleDownload}
                  className="bg-gray-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-gray-700 transition-all text-sm sm:text-base font-semibold"
                >
                  Download Tattoo
                </button>
                <button
                  onClick={() => { 
                    setGallery((prev) => {
                      const updated = [...prev, image];
                      localStorage.setItem('gallery', JSON.stringify(updated));
                      setSaved(true);
                      return updated;
                    });
                  }}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all text-sm sm:text-base font-semibold"
                >
                 {saved ? "Saved" : 'Save'}
                </button>

              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm">Waiting for your ideas...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Generate;