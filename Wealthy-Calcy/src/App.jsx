import React, { useEffect, useState } from 'react';

function App() {
  const [personList, setPersonList] = useState([]);
  const [weath, setWealth] = useState(0);

  const addPerson = async () => {
    const res = await fetch('https://randomuser.me/api');
    const data = await res.json();

    const user = data.results[0];
    let randomNumber = Math.floor(Math.random() * 1000000);
    if (randomNumber < 100000) {
      randomNumber = randomNumber + 100000;
    }

    setPersonList((prev) => [
      ...prev,
      { name: `${user.name.first} ${user.name.last}`, money: randomNumber }
    ]);
  };

  const doubleMoney = () => {
    setPersonList((prev) =>
      prev.map((person) => ({
        ...person,
        money: person.money * 2
      }))
    );
  };

  const showOnlyMillionar = () => {
    setPersonList((prev) =>
      prev.filter((person) => person.money > 1000000)
    );
  };

  const shortByRichest = () => {
    setPersonList((prev) =>
      [...prev].sort((a, b) => b.money - a.money)
    );
  };

  const calculateEntireWealth = () => {
    setWealth(
      personList.reduce((acc, curr) => acc + curr.money, 0)
    );
  };

  useEffect(() => {
    addPerson();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white py-6 px-4">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        DOM Array Methods
      </h1>

      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row md:space-x-6 border p-4 md:p-6 rounded shadow bg-white">
        
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-col md:w-1/4 gap-2 mb-4 md:mb-0">
          <button onClick={addPerson} className="px-3 py-2 border rounded hover:bg-gray-100 text-sm md:text-base">
            Add User 👱‍♂️
          </button>
          <button onClick={doubleMoney} className="px-3 py-2 border rounded hover:bg-gray-100 text-sm md:text-base">
            Double Money 💰
          </button>
          <button onClick={showOnlyMillionar} className="px-3 py-2 border rounded hover:bg-gray-100 text-sm md:text-base">
            Show Only Millionaires 💵
          </button>
          <button onClick={shortByRichest} className="px-3 py-2 border rounded hover:bg-gray-100 text-sm md:text-base">
            Sort by Richest ↓
          </button>
          <button onClick={calculateEntireWealth} className="px-3 py-2 border rounded hover:bg-gray-100 text-sm md:text-base">
            Calculate Entire Wealth 🧮
          </button>
        </div>


        {/* Person List */}
        <div className="flex-1 overflow-x-auto">
          {/* Table Header */}
          <div className="flex justify-between border-b pb-2 font-semibold text-sm md:text-lg">
            <span>Person</span>
            <span>Wealth</span>
          </div>

          {/* Data */}
          {personList.map((person, i) => (
            <div key={i} className="flex justify-between w-full py-2 border-b text-sm md:text-base">
              <span>{person.name}</span>
              <span>
                $
                {person.money.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}

          {/* Total Wealth */}
          {weath > 0 && (
            <div className="flex justify-between w-full mt-2 pt-2 font-bold text-sm md:text-base">
              <span>Total Wealth:</span>
              <span>
                $
                {weath.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
