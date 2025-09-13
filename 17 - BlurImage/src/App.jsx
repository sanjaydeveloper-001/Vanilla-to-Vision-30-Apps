import { useState, useRef } from "react";

function App() {
  const [blur, setBlur] = useState(2);
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
    };
  };

  const downloadImage = () => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply blur filter
      ctx.filter = `blur(${blur}px)`;
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = "blurred-image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center 
      bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 
      font-sans p-4">
      
      <div className="w-full max-w-[450px] shadow-lg shadow-gray-400 
        m-2 flex items-start flex-col p-6 rounded-2xl bg-white 
        space-y-5 border border-gray-200">
        
        <h1 className="text-3xl font-bold text-indigo-700 tracking-wide">
          Image <span className="text-pink-500">Blur Tool</span>
        </h1>

        {!image ? (
          <>
            <h2 className="text-lg font-semibold text-gray-700">
              Upload <span className="text-indigo-600">Image</span>
            </h2>
            <button
              onClick={() => document.getElementById("image").click()}
              className="h-20 w-full text-4xl rounded-2xl shadow-md shadow-gray-200 
                flex justify-center items-center bg-gradient-to-r from-indigo-100 to-purple-100 
                hover:from-indigo-200 hover:to-purple-200 transition cursor-pointer 
                border-2 border-dashed border-indigo-400 text-indigo-600"
            >
              +
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              id="image"
              style={{ display: "none" }}
            />
          </>
        ) : (
          <>
            <div className="w-full rounded-xl shadow-md shadow-gray-300 
              flex justify-center items-center bg-gray-50 overflow-hidden">
              <img
                src={image}
                alt="uploaded"
                className="max-h-[45vh] w-full object-contain rounded-xl"
                style={{ filter: `blur(${blur}px)` }}
              />
            </div>

            {/* Blur Slider */}
            <div className="w-full space-y-2">
              <label
                htmlFor="range"
                className="block text-sm font-medium text-gray-700"
              >
                Blur:{" "}
                <span className="font-bold text-indigo-600">{blur}px</span>
              </label>
              <input
                type="range"
                id="range"
                min={0}
                max={20}
                value={blur}
                onChange={(e) => setBlur(e.target.value)}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row w-full gap-3">
              <button
                onClick={downloadImage}
                className="flex-1 h-10 rounded-lg text-base font-semibold 
                  text-white bg-gradient-to-r from-indigo-500 to-purple-500 
                  cursor-pointer hover:from-indigo-600 hover:to-purple-600 transition"
              >
                Download
              </button>

              <button
                onClick={() => {
                  setImage(null);
                  setBlur(0);
                }}
                className="flex-1 h-10 rounded-lg text-base font-semibold 
                  text-white bg-gradient-to-r from-gray-500 to-gray-600 
                  cursor-pointer hover:from-gray-600 hover:to-gray-700 transition"
              >
                Remove
              </button>
            </div>
          </>
        )}
      </div>

      {/* Canvas for download */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default App;
