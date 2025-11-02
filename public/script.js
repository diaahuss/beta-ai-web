// script.js

// Assuming storedUser is defined globally from register page
// e.g., storedUser = { name: "Diaa", phone: "123456", pin: "1234" }

const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const userId = storedUser.phone; // unique identifier per user

function addMessage(text, sender) {
  const msgElem = document.createElement("div");
  msgElem.className = sender === "user" ? "message user" : "message ai";
  msgElem.textContent = text;
  messagesContainer.appendChild(msgElem);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage(`You: ${message}`, "user");
  messageInput.value = "";

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, userId })
    });

    const data = await res.json();
    addMessage(`Theo: ${data.response}`, "ai");
  } catch (err) {
    console.error(err);
    addMessage("Theo: Sorry, something went wrong.", "ai");
  }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
