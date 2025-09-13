import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.post("/api/color", async (req, res) => {
  try {
    const { promt } = req.body;
    if (!promt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Give me 5 hex colors only (no text, just hex codes) for: ${promt}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "AI Color Palette",
        },
      }
    );

    const raw = response.data.choices[0].message.content;
    const colors = raw.split("\n").map(c => c.trim()).filter(c => c.startsWith("#"));

    res.json({ colors });
  } catch (err) {
    console.error("🔥 Backend error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});


app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
