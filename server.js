// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON bodies (for future API requests)
app.use(express.json());

// Optional endpoint for AI response (currently returns mock)
app.post("/api/ai", (req, res) => {
  const { message } = req.body;

  // Mock AI response
  const mockResponse = `Theo: Sorry, I couldn’t reach the AI right now. (mock)`;

  res.json({ response: mockResponse });
});

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
