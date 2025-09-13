import { useState } from "react";
import { motion } from "framer-motion";

export default function BMICalculator() {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
  });

  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");
  const [healthyWeightRange, setHealthyWeightRange] = useState("");
  const [bmiPrime, setBmiPrime] = useState(null);
  const [ponderalIndex, setPonderalIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateBMI = (e) => {
    e.preventDefault();

    const hCm = parseFloat(form.height);
    const wKg = parseFloat(form.weight);
    if (!hCm || !wKg) return;

    const hM = hCm / 100;
    const bmiVal = wKg / (hM * hM);
    setBmi(Number(bmiVal.toFixed(1)));

    let st = "";
    if (bmiVal < 18.5) st = "Underweight";
    else if (bmiVal < 25) st = "Normal";
    else if (bmiVal < 30) st = "Overweight";
    else st = "Obese";
    setStatus(st);

    const minW = 18.5 * hM * hM;
    const maxW = 25 * hM * hM;
    setHealthyWeightRange(`${minW.toFixed(1)} kg - ${maxW.toFixed(1)} kg`);

    setBmiPrime(Number((bmiVal / 25).toFixed(2)));
    setPonderalIndex(Number((wKg / (hM * hM * hM)).toFixed(1)));
  };

  const getArrowPosition = (bmi) => {
    if (bmi < 18.5) {
      return `${(bmi / 18.5) * 25}%`; // Scale inside first 25%
    } else if (bmi < 25) {
      return `${25 + ((bmi - 18.5) / (25 - 18.5)) * 25}%`; // Scale inside second 25%
    } else if (bmi < 30) {
      return `${50 + ((bmi - 25) / (30 - 25)) * 25}%`; // Scale inside third 25%
    } else {
      return `${75 + Math.min(((bmi - 30) / 10) * 25, 25)}%`; // Scale inside last 25% (cap at 100%)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-violet-100 to-purple-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6"
      >
        <h1 className="text-2xl font-bold text-center text-violet-700 mb-6">
          BMI Calculator
        </h1>

        <form onSubmit={calculateBMI} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-400"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={form.age}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              placeholder="Enter your height in cm"
              value={form.height}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              placeholder="Enter your weight in kg"
              value={form.weight}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-violet-600 text-white p-3 rounded-xl font-semibold shadow-md hover:bg-violet-700 transition"
          >
            Calculate BMI
          </motion.button>
        </form>

        {bmi !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <h2 className="text-xl font-bold text-center text-gray-700">
              Hello, {form.name} 👋
            </h2>
            <p className="text-center text-lg font-semibold text-gray-600">
              Your BMI: <span className="text-violet-600">{bmi}</span> ({status}
              )
            </p>

            {/* BMI Gauge */}
            <div className="mt-6 w-full relative">
              <p className="text-lg font-semibold mb-2">BMI Range</p>

              {/* Chart Bar */}
              <div className="relative w-full h-10 grid grid-cols-4 rounded overflow-hidden text-xs font-bold text-white">
                <div className="bg-blue-400 flex items-center justify-center">
                  Under
                </div>
                <div className="bg-green-500 flex items-center justify-center">
                  Normal
                </div>
                <div className="bg-yellow-400 flex items-center justify-center">
                  Over
                </div>
                <div className="bg-red-500 flex items-center justify-center">
                  Obese
                </div>
              </div>

              {/* Arrow indicator */}
              {bmi && (
                <div
                  className="absolute top-0 text-2xl transition-all duration-500"
                  style={{
                    left: getArrowPosition(bmi),
                    transform: "translateX(-50%) translateY(180%)",
                  }}
                >
                  ▲
                </div>
              )}

              {/* Labels under bar */}
              <div className="grid grid-cols-4 text-xs font-medium text-gray-700 mt-2">
                <span>{"< 18.5"}</span>
                <span className="text-center">18.5 – 24.9</span>
                <span className="text-center">25 – 29.9</span>
                <span className="text-right">{">= 30"}</span>
              </div>
            </div>

            {/* Extra info */}
            <div className="mt-6 text-sm sm:text-base space-y-2 text-gray-700">
              <p>
                • Healthy BMI range: <b>18.5 – 25 kg/m²</b>
              </p>
              <p>
                • Healthy weight for this height: <b>{healthyWeightRange}</b>
              </p>
              <p>
                • BMI Prime: <b>{bmiPrime}</b>
              </p>
              <p>
                • Ponderal Index: <b>{ponderalIndex} kg/m³</b>
              </p>
            </div>
          </motion.div>
        )}
        <p className="text-center text-sm text-gray-500 mt-6">
          Made with <span className="text-red-500">❤️</span> by{" "}
          <span className="font-semibold">Sanjay</span>
        </p>
      </motion.div>
    </div>
  );
}
