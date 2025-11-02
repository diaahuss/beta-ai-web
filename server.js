// server.js — Backend + Frontend for Railway and Local

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files from public folder
app.use(express.static(path.join(process.cwd(), "public")));

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Optional health check route
app.get("/health", (req, res) => {
  res.send("✅ BetaAI Server is running successfully!");
});

// AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are BetaAI assistant." },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("❌ /api/chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Use Railway PORT if available, otherwise fallback to 3000 for local
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
