import React from "react";
import CreationBox from "./Components/CreationBox";
import List from "./Components/List";
import { useState } from "react";
import { useEffect } from "react";
import EditBox from "./Components/EditBox";

const App = () => {
  const apiLink = `${import.meta.env.VITE_BACKEND_LINK}/api/quotes`;
  const [quotes, setQuotes] = useState([]);
  const [editID, setEditID] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchQuotes = async () => {
    const res = await fetch(apiLink);
    const data = await res.json();
    setQuotes(data);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <div className="w-full h-[100vh] flex flex-col justify-start items-center py-20">
      <h1 className="text-3xl font-bold">CRUD API</h1>
      {editID ? (
        <EditBox
          editID={editID}
          editText={editText}
          setEditText={setEditText}
          setEditID={setEditID}
          fetchQuotes={fetchQuotes}
        />
      ) : (
        <CreationBox fetchQuotes={fetchQuotes} />
      )}
      <List
        quotes={quotes}
        setEditID={setEditID}
        setEditText={setEditText}
        fetchQuotes={fetchQuotes}
      />
    </div>
  );
};

export default App;
