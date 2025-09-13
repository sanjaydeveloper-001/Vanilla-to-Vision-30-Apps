import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let quotes = [];
let id = 1;

//Test API (Get, Post, Put, Delete) =>  CRUD
app.get("/", (req, res) => {
  res.send("Hello");
});

//Get Method with Array
app.get("/api/quotes", (req, res) => {
  res.json(quotes);
});

// POST method
app.post("/api/quotes", (req, res) => {
  const { text } = req.body;

  const newQuotes = { id: id++, text };
  quotes.push(newQuotes);
  res.status(201).json(newQuotes);
});

// Put (update) a quote
app.put("/api/quotes/:id", (req, res) => {
  const quoteID = parseInt(req.params.id);
  const { text } = req.body;

  const quote = quotes.find((q) => q.id === quoteID);

  if (quote) {
    quote.text = text;
    res.json(quote);
  } else {
    res.status(404).json({ error: "Quote not found" });
  }
});

// Delete a quote
app.delete("/api/quotes/:id", (req, res) => {
  const quoteID = parseInt(req.params.id);
  quotes = quotes.filter((q) => q.id != quoteID);
  res.status(204).send("Deleted Successfully");
});

app.listen(PORT, () =>
  console.log("Server is running on local server port :" + PORT)
);
