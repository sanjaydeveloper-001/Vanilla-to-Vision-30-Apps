import { useState } from "react";
import axios from "axios";

function Home() {
  const [idea, setIdea] = useState("");
  const [type, setType] = useState("AI SaaS");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!idea.trim()) {
      alert("Please enter your idea first!");
      return;
    }

    try {
      setLoading(true);
      setResult("");
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generate`, {
        idea,
        type,
      });

      setResult(res.data.choices[0].message.content);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
    });
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="p-6 w-full max-w-xl h-max rounded-2xl shadow-md shadow-gray-400 bg-white m-2 mx-auto">
      <div className="w-full flex flex-col">
        <h1 className="w-full font-bold text-2xl sm:text-3xl text-blue-500 text-center">
          AI Website Generator
        </h1>
        
        <label htmlFor="promt"  className="font-semibold text-[16px] mt-4 text-gray-500">Enter Idea:</label>
        <input
          type="text"
          id='promt'
          placeholder="Enter your product idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          className="w-full px-3 py-2 outline-none border-2 border-gray-300 rounded focus:border-gray-500 font-semibold text-gray-600"
        />
        <label htmlFor="promptType" className="font-semibold text-[16px] mt-4 text-gray-500">Select Type:</label>
        <select
          name="type"
          id="promptType"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 outline-none border-2 border-gray-300 rounded font-semibold text-gray-600"
        >
          <option value="AI SaaS">AI SaaS</option>
          <option value="Productive Tool">Productive Tool</option>
          <option value="Startup">Startup</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 w-full px-3 py-2 bg-gradient-to-r from-blue-400 to-blue-300 hover:scale-102 transition-all duration-200 cursor-pointer text-white rounded font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Page"}
        </button>

        {result && (
          <div className="w-full mt-6">
            <h2 className="sm:text-xl font-bold mb-2">Live Preview:</h2>
            <div
              className="w-full border rounded-lg overflow-hidden"
              dangerouslySetInnerHTML={{ __html: result }}
            />

            <h2 className="sm:text-xl font-bold mb-2 mt-6 flex items-center justify-between">
              Generated HTML:
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >{
                copied ? "Copied!" : "Copy Code"
              }
              </button>
            </h2>

            <pre className="p-4 bg-gray-100 rounded overflow-x-auto max-h-96 text-sm whitespace-pre">
              {result}
            </pre>
          </div>
        )}
        <div className="w-full flex justify-center items-center mt-4">
          <p className="text-sm text-gray-500">
            Made with ❤️ by Sanjay
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
