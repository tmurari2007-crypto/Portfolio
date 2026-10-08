require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini Client
// Requires GEMINI_API_KEY in .env
let ai = null;
if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
    console.warn("WARNING: GEMINI_API_KEY not found in environment variables. Chatbot will use fallback responses.");
}

// Load Portfolio Data as System Instruction
const portfolioDataPath = path.join(__dirname, '../frontend/data/portfolioData.json');
let portfolioData = {};
try {
    const rawData = fs.readFileSync(portfolioDataPath, 'utf8');
    portfolioData = JSON.parse(rawData);
} catch (err) {
    console.error("Error loading portfolio data:", err);
}

const systemInstruction = `
You are the AI Portfolio Assistant for Murarisai Tadepalli.
Your job is to answer questions based ONLY on the following portfolio data. 
Do not hallucinate, invent, or guess any information. If you don't know the answer, say "I don't have that information in my portfolio yet."
Keep your answers concise, professional, and helpful. 

Portfolio Data:
${JSON.stringify(portfolioData, null, 2)}
`;

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        if (!ai) {
            return res.json({ reply: "I'm sorry, my AI backend is not fully configured yet (Missing API Key). But I know Murari is a great developer! Please contact him directly." });
        }

        // Call Gemini Model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2
            }
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
