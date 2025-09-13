const EditBox = ({ editID, editText, setEditText, setEditID, fetchQuotes }) => {
  const apiLink = `${import.meta.env.VITE_BACKEND_LINK}/api/quotes`;

  const handleUpdate = async () => {
    if (!editText) {
      alert("Type something to Update!");
      return;
    }

    const res = await fetch(`${apiLink}/${editID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: editText }),
    });

    if (res.ok) {
      setEditText("");
      setEditID(null);
      fetchQuotes();
    } else {
      console.log("not working");
    }
  };

  return (
    <div className="w-[350px] h-max py-5  flex">
      <input
        type="text"
        className="w-full outline-none border h-10 pl-2"
        placeholder="Update"
        value={editText}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleUpdate();
          }
        }}
        onChange={(e) => setEditText(e.target.value)}
      />
      <button
        className="p-2 px-4 bg-green-600 ml-1 text-white cursor-pointer"
        onClick={handleUpdate}
      >
        Update
      </button>
    </div>
  );
};

export default EditBox;
