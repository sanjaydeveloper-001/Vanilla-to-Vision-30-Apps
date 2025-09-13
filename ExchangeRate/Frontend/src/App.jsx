import { useEffect, useState } from "react";
import Money from "./assets/money.png";
import currencies from "./util/currency";
import axios from "axios";

function App() {
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState(1);
  const [toChangeCurrency, setToChangeCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  // Fetch exchange rate when currency changes
  useEffect(() => {
    if (currency && toChangeCurrency) {
      fetchExchangeRate();
    }
  }, [currency, toChangeCurrency, amount]);

  const fetchExchangeRate = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/rates/${currency}`
      );
      const rate = res.data.conversion_rates[toChangeCurrency];
      setExchangeRate(rate);
      setConvertedAmount((amount * rate).toFixed(2));
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-br from-green-100 to-amber-100 flex justify-center items-center">
      <div className="w-max h-max p-8 border-4 border-green-400 rounded-2xl shadow-lg bg-white flex flex-col items-center space-y-4 m-2">
        
        {/* Logo */}
        <img src={Money} className="w-28 h-28 mb-4" alt="money" />
        <h1 className="text-4xl font-extrabold text-green-700">Exchange Currency</h1>
        <p className="text-lg text-gray-600">
          Choose the currency and the amount to get the latest exchange rate.
        </p>

        {/* From Currency */}
        <div className="w-full flex items-center py-2 justify-between space-x-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-[40%] border-2 p-2 rounded-lg border-green-500 bg-white focus:ring-2 focus:ring-green-300 font-semibold text-gray-700"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-2 border-yellow-500 p-2 rounded-lg w-40 text-center font-semibold outline-none text-gray-700"
          />
        </div>

        {/* To Currency */}
        <div className="w-full flex items-center py-2 justify-between space-x-4">
          <select
            value={toChangeCurrency}
            onChange={(e) => setToChangeCurrency(e.target.value)}
            className="w-[40%] border-2 p-2 rounded-lg border-green-500 bg-white focus:ring-2 focus:ring-green-300 font-semibold text-gray-700"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={convertedAmount || ""}
            readOnly
            className={`border-2 border-yellow-500 p-2 rounded-lg w-40 text-center bg-gray-50 outline-none font-semibold text-gray-700 ${convertedAmount <=0 ? '' : 'ring-2 ring-yellow-500/50'}`}
          />
        </div>

        {/* Result */}
        {exchangeRate && (
          <p className="mt-4 text-lg font-semibold text-green-700">
            1 {currency} = {exchangeRate} {toChangeCurrency}
          </p>
        )}


        {/* Owner */}
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
