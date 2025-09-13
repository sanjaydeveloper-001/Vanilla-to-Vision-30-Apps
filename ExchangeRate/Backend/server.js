import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/rates/:base", async (req, res) => {
  try {
    const { base } = req.params;
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API}/latest/${base}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rates" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
