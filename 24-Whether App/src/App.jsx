import { useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_KEY = 'b168c6a6cbb742f081a135836250909';
  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`
      );

      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      // console.log(data);
      setWeather(data); // ✅ set weather properly
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-200">
          🌤️ Weather Forecast
        </h1>

        {/* Search Box */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={fetchWeather}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all"
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-blue-200 animate-pulse">
            Fetching weather...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-400 font-medium">{error}</p>
        )}

        {/* Weather Card */}
        {weather && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 rounded-xl p-6 mt-4 text-center space-y-4"
          >
            <h2 className="text-2xl font-semibold">
              {weather.location.name}, {weather.location.region}
            </h2>
            <p className="text-lg capitalize">
              {weather.current.condition.text}
            </p>
            <img
              src={weather.current.condition.icon}
              alt="weather icon"
              className="mx-auto"
            />

            {/* Temperature */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="text-6xl font-bold text-yellow-300"
            >
              {Math.round(weather.current.temp_c)}°C
            </motion.div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="flex items-center justify-center gap-2 bg-white/10 p-3 rounded-lg">
                <Thermometer className="w-5 h-5" /> Feels like{" "}
                {Math.round(weather.current.feelslike_c)}°C
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/10 p-3 rounded-lg">
                <Droplets className="w-5 h-5" /> Humidity{" "}
                {weather.current.humidity}%
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/10 p-3 rounded-lg">
                <Wind className="w-5 h-5" /> Wind {weather.current.wind_kph} km/h{" "}
                {weather.current.wind_dir}
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/10 p-3 rounded-lg">
                <Cloud className="w-5 h-5" /> Clouds {weather.current.cloud}%
              </div>
            </div>
          </motion.div>
        )}
        <p className="text-center text-white text-sm pt-4">
        Made with ❤️ by Sanjay
      </p>
      </motion.div>
      
    </div>
  );
}
