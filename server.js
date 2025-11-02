// server.js
const express = require("express");
const path = require("path");
const fetch = require("node-fetch"); // for API calls
require("dotenv").config(); // load .env

const app = express();
const PORT = process.env.PORT || 8080;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory chat history per user
const chatHistories = {}; // key: userId, value: array of messages

// AI endpoint
app.post("/api/ai", async (req, res) => {
  const { message, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ response: "Missing userId" });
  }

  if (!chatHistories[userId]) {
    chatHistories[userId] = [
      { role: "system", content: "Theo is a friendly health companion. Always polite, helpful, and concise." }
    ];
  }

  chatHistories[userId].push({ role: "user", content: message });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: chatHistories[userId],
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("Invalid AI response");
    }

    const aiReply = data.choices[0].message.content;
    chatHistories[userId].push({ role: "assistant", content: aiReply });

    res.json({ response: aiReply });

  } catch (error) {
    console.error("AI request error:", error);
    res.status(500).json({ response: "Theo: Sorry, I couldn’t reach the AI right now." });
  }
});

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Important for Railway
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
