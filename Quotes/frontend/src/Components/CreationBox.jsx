import { useState } from "react";

const CreationBox = ({ fetchQuotes }) => {
  const apiLink = `${import.meta.env.VITE_BACKEND_LINK}/api/quotes`;

  const [newQuote, setNewQuote] = useState("");

  const handleAdd = async () => {
    if (!newQuote.trim()) {
      alert("Type some quote!");
      return;
    }
    const res = await fetch(apiLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newQuote }),
    });
    if (res.ok) {
      setNewQuote("");
      fetchQuotes();
    }
  };

  return (
    <div className="w-[350px] h-max py-5  flex">
      <input
        type="text"
        className="w-full outline-none border h-10 pl-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAdd();
          }
        }}
        placeholder="Add Quote"
        value={newQuote}
        onChange={(e) => setNewQuote(e.target.value)}
      />
      <button
        className="p-2 px-4 bg-green-600 ml-1 text-white cursor-pointer"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
};

export default CreationBox;
