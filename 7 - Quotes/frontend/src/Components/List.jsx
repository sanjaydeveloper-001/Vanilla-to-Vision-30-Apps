import React, { useState } from "react";

const List = ({ quotes, setEditID, setEditText, fetchQuotes }) => {
  const apiLink = `${import.meta.env.VITE_BACKEND_LINK}/api/quotes`;

  const handleDelete = async (id) => {
    const res = await fetch(`${apiLink}/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchQuotes();
    }
  };

  return (
    <>
      {quotes.length === 0 ? (
        <h1>Quotes is Empty</h1>
      ) : (
        <div className="w-[350px] space-y-4 pb-10">
          {quotes.map((q, i) => {
            return (
              <div
                key={q.id || i}
                className="w-full border p-1 flex justify-between items-center gap-2"
              >
                <h1 className="whitespace-pre-line break-words break-all">
                  {q.text}
                </h1>
                <div className="flex shrink-0 gap-2">
                  <button
                    className="px-2 py-1 border bg-gray-100 hover:bg-blue-100"
                    onClick={() => {
                      setEditID(q.id);
                      setEditText(q.text);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(q.id)}
                    className="px-2 py-1 border bg-red-400 hover:bg-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default List;
