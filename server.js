// server.js
const express = require("express");
const path = require("path");
const fetch = require("node-fetch"); // for API calls
require("dotenv").config(); // load .env

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory chat history per user
const chatHistories = {}; // key: userId (phone or generated id), value: array of messages

// AI endpoint
app.post("/api/ai", async (req, res) => {
  const { message, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ response: "Missing userId" });
  }

  // Initialize chat history for new user
  if (!chatHistories[userId]) {
    chatHistories[userId] = [
      { role: "system", content: "Theo is a friendly health companion. Always polite, helpful, and concise." }
    ];
  }

  // Add user message to history
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
    const aiReply = data.choices[0].message.content;

    // Save AI reply in history
    chatHistories[userId].push({ role: "assistant", content: aiReply });

    res.json({ response: aiReply });

  } catch (error) {
    console.error(error);
    res.json({ response: "Theo: Sorry, I couldn’t reach the AI right now." });
  }
});

// Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
