import React, { useState } from "react";
import axios from "axios";

function App() {
  const [promt, setPromt] = useState("");
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);

  const generateColors = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/color`,
        { promt } 
      );

      const result = response.data.colors;
      console.log(result);
      setColors(result);
    } catch (error) {
      console.log("❌ Frontend Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-[#d9c8ff] p-2">
      <div className="w-[500px] h-max p-6 border border-white rounded-xl flex flex-col justify-center items-center m-2 bg-white shadow-lg shadow-gray-700">
        <h1 className="text-4xl text-[#7046cc] font-bold w-max">
          AI Color Palette
        </h1>
        <input
          onKeyDown={ (e) => {
            if (e.key === "Enter") {
              generateColors();
             }
            }
          }
          value={promt}
          onChange={(e) => setPromt(e.target.value)}
          type="text"
          className="w-full h-[50px] rounded-lg mt-15 border-2 border-gray-400 outline-none focus:border-gray-800 px-2 text-xl text-gray-600 font-semibold"
          placeholder="Enter your color/ patterns"
        />
        <button
          onClick={generateColors}
          className="w-full text-xl rounded-lg mt-4 bg-[#a683f1] text-white font-bold py-2 hover:bg-[#a683f1]/90 cursor-pointer"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {colors.length > 0 && (
          <div className="w-full h-max flex flex-col justify-center items-center mt-4">
            <h1 className="text-2xl text-[#08001a] font-bold w-max">
              Generated Colors : 
            </h1>
            <div className="w-full h-max flex flex-wrap justify-center items-center mt-4">
              {colors.map((color, index) => (
                <div
                  key={index}
                  style={{ backgroundColor: color }}
                  className="w-[100px] h-[100px] rounded-lg m-2 text-[16px] font-semibold justify-center items-center flex text-white "
                >
                  <h1 className="bg-gray-100/20 rounded-[5px] text-black px-1">{color}</h1>
                </div>
              ))}
            </div>
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

export default App;
