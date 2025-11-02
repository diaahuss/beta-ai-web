// ✅ server.js — Production Ready for Railway

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default route
app.get("/", (req, res) => {
  res.send("✅ BetaAI Server is running successfully on Railway!");
});

// Example AI route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are BetaAI assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error in /api/chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get the port from Railway
const PORT = process.env.PORT;
if (!PORT) {
  console.error("❌ No PORT defined in environment");
  process.exit(1);
}

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
