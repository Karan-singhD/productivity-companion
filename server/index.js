import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/advice", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) return res.status(400).json({ error: "Task is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a productivity coach. give concise, practical advice in 3  detailed bullet points.
Task: ${task}
Rules:
- Keep it short (max 60 words) unless specifically requested 
- Use bullet points
- No filler
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ advice: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to generate advice" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));