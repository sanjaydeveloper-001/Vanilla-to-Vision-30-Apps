import { useEffect, useState } from "react";
import ScoreBoard from "./Components/ScoreBoard";
import GameBoard from "./Components/GameBoard";
import getAIMoveOpenRouter from "./Utils/aiOpenRouter";
import checkWinner from "./Utils/winner";
import { motion } from "framer-motion";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [winner, setWinner] = useState(null);

  // PlayerTurn
  const handleClick = (i) => {
    if (!isPlayerTurn || winner || board[i]) return;

    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  // AiTurn
  useEffect(() => {
    if(winner) return;

    const result = checkWinner(board);
    if (result?.winner) {
      setWinner(result.winner);
      if(result.winner === "O" || result.winner === "X")
      {
        setScore((prev) => ({
          ...prev,
          [result.winner]: prev[result.winner] + 1,
        }));
      }

      return;
    }

    if (isPlayerTurn || winner) return;

    const aiTurn = async () => {
      const move = await getAIMoveOpenRouter(board);
      // console.log("move"+move);
      if (move && board[move] === null) {
        const newBoard = [...board];
        newBoard[move] = "O";
        setBoard(newBoard);

        setIsPlayerTurn(true);
      }
    };

    const timeout = setTimeout(aiTurn, 2000);
    return () => clearTimeout(timeout);
  }, [board]);

  // Restart the game
  const restart = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-5 ">Tic Tac Tai 🤖</h1>

      <ScoreBoard score={score} />
      <GameBoard board={board} handleClick={handleClick} />

      {winner && (
        <div className="mt-5 text-2xl flex flex-col items-center justify-center gap-3">
          {winner === "Draw" ? "It's Draw Match" : `${winner} wins!`}
          <motion.button whileTap={{scale:0.9}} onClick={restart} className="px-5 py-2 bg-[#2b3358] rounded-2xl text-xl cursor-pointer hover:bg-[#202a58]">
            Play Again
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default App;
