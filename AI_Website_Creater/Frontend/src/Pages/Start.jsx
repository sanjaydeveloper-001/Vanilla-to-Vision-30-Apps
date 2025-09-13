
function Start({setStart}) {
  return (
    <div className="h-max rounded-2xl shadow-lg shadow-gray-400 flex flex-col justify-center items-center bg-gray-50 p-15 my-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            AI Landing Page Generator
      </h1>
      <p className="text-lg text-gray-600 mb-6 text-center max-w-xl">
        Create stunning, responsive landing pages instantly with AI.
      </p>


      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl">
        <div className="p-6 bg-white shadow rounded-xl text-center">
          <h3 className="text-xl font-semibold mb-2">✨ Instant Pages</h3>
        </div>
        <div className="p-6 bg-white shadow rounded-xl text-center">
          <h3 className="text-xl font-semibold mb-2">🎨 Tailwind CSS</h3>
        </div>
        <div className="p-6 bg-white shadow rounded-xl text-center">
          <h3 className="text-xl font-semibold mb-2">⚡ Fast & Simple</h3>
        </div>
      </div>

      {/* Button to go Home */}
      <button
        onClick={()=>setStart(true)}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
      >
        Get Started
      </button>
    </div>
  );
}

export default Start;
