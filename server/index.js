import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running ");
});

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

// pick a working gemini model
let pickedModelName = null;

async function pickModel() {
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await r.json();

    if (!data.models || !Array.isArray(data.models)) {
      console.error("❌ Could not list models. Response:", data);
      return;
    }

    // prefer flash first (fast + cheap), If not available, pick any  model
    const names = data.models.map((m) => m.name); 
    const preferred =
      names.find((n) => n.includes("gemini") && n.includes("flash")) ||
      names.find((n) => n.includes("gemini")) ||
      null;

    if (!preferred) {
      console.error("❌ No Gemini models found for this key.");
      return;
    }

    // 
    pickedModelName = preferred.replace("models/", "");
    console.log("✅ Picked Gemini model:", pickedModelName);
  } catch (e) {
    console.error("❌ Failed to pick model:", e?.message || e);
  }
}

// run once at startup
await pickModel();

// non-AI fallback 
function fallbackAdvice(task) {
  const tips = [
    "Break it into 3 small steps and do step 1 now.",
    "Set a 10-minute timer and do a quick start.",
    "Work 25 minutes focused, then take a 5-minute break.",
    "Write what “done” looks like, then work backwards.",
    "Remove distractions and do the hardest 5 minutes first."
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  return `For "${task}", ${tip}`;
}

app.post("/api/advice", async (req, res) => {
  const { task } = req.body;
  if (!task || !task.trim()) {
    return res.status(400).json({ error: "Task is required" });
  }

  try {
    if (!pickedModelName) {
      // If model selection failed, still return something
      return res.json({ advice: fallbackAdvice(task) });
    }

    const model = genAI.getGenerativeModel({ model: pickedModelName });

    const prompt = `You are a productivity coach.
Give concise, practical advice in 3 bullet points (max 200 words total), unless otherwise specifally specified by the user.
Task: ${task}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.json({ advice: text });
  } catch (err) {
    // If gemini fails for ANY reason, your app still works
    console.error("Gemini error:", err?.message || err);
    return res.json({ advice: fallbackAdvice(task) });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});