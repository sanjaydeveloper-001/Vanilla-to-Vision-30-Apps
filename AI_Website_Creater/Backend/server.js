import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  try {
    const { idea, type } = req.body;

    if (!idea || !type) {
      return res.status(400).json({ error: "Missing idea or type" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions", // ✅ OpenRouter endpoint
      {
        model: "openai/gpt-3.5-turbo", // ✅ OpenAI via OpenRouter
        messages: [
          {
            role: "user",
            content: `Generate a clean, modern, and fully responsive HTML landing page for a ${type} product called "${idea}".
                      Requirements:
                      - Use only plain HTML with Tailwind CSS classes (no external CSS or JS).  
                      - The page must be responsive for all screen sizes starting from 350px width and above.  
                      - Use a centered container with max-w-5xl mx-auto px-4 for layout.  
                      - Structure:
                        1. A bold main heading with the product name.  
                        2. A short subheading/description below it.  
                        3. Three feature cards in a responsive grid with grid-cols-1 sm:grid-cols-2 lg:grid-cols-3.  
                        4. A clear call-to-action button centered at the bottom.  
                      - The design should be minimal, clean, and professional.  
                      - Always include: <meta name="viewport" content="width=device-width, initial-scale=1.0">  
                      - Return ONLY valid HTML (no markdown, no explanations).  
              `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", 
          "X-Title": "AI Website Generator",  
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("🔥 OpenRouter API Error:", err.response?.data || err.message);
    res
      .status(500)
      .json({ error: err.response?.data || "Internal Server Error" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
