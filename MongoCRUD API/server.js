import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mongo Schema
const quoteSchema = new mongoose.Schema({ 
    text : {
        type:String,
        required:true,
        trim:true,
        minlength:1
    }
} , {timestamps:true});

const Quotes = mongoose.model("Quote" , quoteSchema);

// MongoDB Connect
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("MongoDB Connected!"))
.catch((err) => console.log("MongoDB Error : "+err.message));

// Test API 

app.get( "/api/quotes" , async (_req, res) => {

    try {
        const quote = await Quotes.find();
        res.json(quote);
    } catch (err) {
        res.status(500).json({error:"Failed to fetch"}) 
    }
})
// Get 
app.get("/" , (_req, res) => {
    res.send("Hii sanjay");
})

// Post 
app.post("/api/quotes" , async (req, res) => {
    try {
        const { text} = req.body;
        if(!text.trim()){
            return res.status(400).json({error:"Text is required"});
        }
        const created = await Quotes.create({ text:text.trim()});
        res.status(201).json(created);

    } catch (error) {
        res.status(500).json({error:"Failed to create quote"});
    }
})

// Update
app.put("/api/quotes/:id" , async (req, res) => {

    try {
        
        const { id } = req.params;
        const { text } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error:"Id not Valid"});
        if(!text.trim()) return res.status(400).json({error:"text is Required!"});

        const updated = await Quotes.findByIdAndUpdate(id, {text:text.trim()} , {new:true});
        if(!updated) return res.status(404).json({error:"Quote not found"});
        res.status(201).json(updated);


    } catch (error) {
        
    }
})

// Delete
app.delete("/api/quotes/:id" , async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error:"Id is invalid"});

        const deleted = await Quotes.findByIdAndDelete(id);
        res.status(200).json(deleted);
    } catch (error) {
        res.status(500).json({error:"File not found, or deletion error!"});
    }
})

app.listen(PORT , () => {
    console.log("Server is running in http://localhost:"+PORT);
})