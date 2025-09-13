import React, { useState } from "react";
import { motion } from "framer-motion";

// Conversion logic
const conversions = {
  length: {
    m: { cm: (v) => v * 100, km: (v) => v / 1000, ft: (v) => v * 3.28084 },
    cm: { m: (v) => v / 100, km: (v) => v / 100000, ft: (v) => v * 0.0328084 },
    km: { m: (v) => v * 1000, cm: (v) => v * 100000, ft: (v) => v * 3280.84 },
    ft: { m: (v) => v / 3.28084, cm: (v) => v * 30.48, km: (v) => v / 3280.84 },
  },
  weight: {
    kg: { g: (v) => v * 1000, lb: (v) => v * 2.20462 },
    g: { kg: (v) => v / 1000, lb: (v) => v * 0.00220462 },
    lb: { kg: (v) => v / 2.20462, g: (v) => v * 453.592 },
  },
  temperature: {
    C: { F: (v) => (v * 9) / 5 + 32, K: (v) => v + 273.15 },
    F: { C: (v) => ((v - 32) * 5) / 9, K: (v) => ((v - 32) * 5) / 9 + 273.15 },
    K: { C: (v) => v - 273.15, F: (v) => ((v - 273.15) * 9) / 5 + 32 },
  },
};

const units = {
  length: ["m", "cm", "km", "ft"],
  weight: ["kg", "g", "lb"],
  temperature: ["C", "F", "K"],
};

export default function UnitConverter() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("cm");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleConvert = () => {
    if (input === "" || isNaN(input)) {
      setResult("Enter a valid number");
      return;
    }
    if (fromUnit === toUnit) {
      setResult(input);
      return;
    }
    const converter = conversions[category][fromUnit][toUnit];
    if (converter) {
      setResult(converter(parseFloat(input)).toFixed(4));
    } else {
      setResult("Conversion not available");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-100">
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-2xl font-bold text-center text-amber-900 mb-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          🌍 Unit Converter
        </motion.h1>

        {/* Category Selector */}
        <motion.div
          className="mb-4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Category
          </label>
          <select
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-700"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setFromUnit(units[e.target.value][0]);
              setToUnit(units[e.target.value][1]);
            }}
          >
            {Object.keys(units).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Input + Units */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              From
            </label>
            <select
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-700"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              {units[category].map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              To
            </label>
            <select
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-700"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            >
              {units[category].map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Input field */}
        <motion.input
          type="number"
          placeholder="Enter value"
          className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-amber-700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />

        {/* Convert button */}
        <motion.button
          onClick={handleConvert}
          className="w-full bg-amber-700 text-white font-semibold py-2 rounded-xl hover:bg-amber-800 transition cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Convert
        </motion.button>

        {/* Result */}
        {result && (
          <motion.div
            className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-lg font-semibold text-amber-900 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Result: {result} {toUnit}
          </motion.div>
        )}
        <p className="text-center text-green-700 text-sm pt-6">
          Made with ❤️ by Sanjay
        </p>
      </motion.div>
    </div>
  );
}
