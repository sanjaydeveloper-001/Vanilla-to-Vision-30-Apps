import React, { useEffect, useState } from "react";

function App() {
  const [mode, setMode] = useState("Medium");
  const [timer, setTimer] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [randomWord, setRandomWord] = useState("");
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const words = {
    easy: ["cat","dog","run","sun","hat","pen","book","jump","fast","slow","walk","talk","play","stop","go","eat","read","big","small","bed"],
    medium: ["computer","college","typing","language","bottle","window","flower","yellow","father","mother","sister","brother","mobile","happy","market","school","summer","winter","travel","ocean"],
    hard: ["elephant","keyboard","internet","adventure","bicycle","hospital","software","hardware","tomorrow","remember","elephantine","electricity","discovery","impossible","lightning","dictionary","mountain","waterfall","beautiful","furniture"],
    advanced: ["rhythm","psychology","knowledge","millennium","exaggeration","subconscious","acquaintance","miscellaneous","pneumonia","juxtaposition","questionnaire","phenomenon","entrepreneur","equilibrium","pronunciation","ambiguous","kaleidoscope","perseverance","synchronization","parliament"]
  };

  const changeWord = () => {
    const list = words[mode.toLowerCase()];
    setRandomWord(list[Math.floor(Math.random() * list.length)]);
  };

  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setIsRunning(false);
      setFinished(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const startTimer = () => {
    setTimer(mode === "Advanced" ? 8 : 5);
    changeWord();
    setIsRunning(true);
    setFinished(false);
    setScore(0);
  };

  const checkCorrectness = (e) => {
    if (e.target.value === randomWord) {
      const bonus = mode === "Easy" ? 4 : mode === "Medium" ? 3 : 2;
      setTimer(prev => (prev > 15 ? 8 : prev + bonus));
      setScore(prev => prev + 1);
      changeWord();
      e.target.value = "";
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Typing Speed Test</h1>

        {/* Timer + Score + Mode */}
        <div className="flex justify-between items-center mt-4 
                        max-[450px]:flex-col max-[450px]:gap-2 max-[450px]:items-center">
          <h2 className="text-lg font-semibold text-gray-700">⏳ {timer}s</h2>
          <h2 className="text-lg font-semibold text-gray-700">🏆 Score: {score}</h2>
          <div className="flex items-center gap-1 max-[450px]:w-full max-[450px]:justify-center">
            <label htmlFor="mode" className="mr-2 text-gray-700">Level:</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border rounded px-2 py-1 w-full max-[450px]:max-w-[150px]"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Game Area */}
        {isRunning ? (
          <div className="flex flex-col items-center mt-6 w-full">
            <h1 className="text-gray-700">Type the word below:</h1>
            <h1 className="text-4xl font-bold text-indigo-600 mt-2 text-center">{randomWord}</h1>
            <input
              onChange={checkCorrectness}
              type="text"
              className="w-full border-2 border-indigo-300 rounded-lg h-12 px-3 text-xl mt-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>
        ) : finished ? (
          <div className="flex flex-col items-center mt-6 w-full">
            <h1 className="text-lg text-gray-700">Test Ended ✅</h1>
            <h1 className="text-lg text-gray-700 font-bold">Final Score: {score}</h1>
            <button
              onClick={startTimer}
              className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Restart
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-6 w-full">
            <h1 className="text-gray-700">Click below to start the test</h1>
            <button
              onClick={startTimer}
              className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Start
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
