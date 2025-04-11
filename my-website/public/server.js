import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/sanatanDB')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fix __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    
    try {
        await mongoose.connection.collection("emails").insertOne({ email });
        res.status(200).json({ message: "✅ Email saved!" });
    } catch (error) {
        res.status(500).json({ message: "❌ Error saving email" });
    }
});

app.post('/question', async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        await mongoose.connection.collection("questions").insertOne({ title, description, category });
        res.status(200).json({ message: "✅ Question saved!" });
    } catch (error) {
        res.status(500).json({ message: "❌ Error saving question" });
    }
});

// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
