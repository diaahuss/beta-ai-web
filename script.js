// Mock key (replace later)
const MOCK_API_KEY = "sk-mock-key-1234";

// ---------------- LOGIN ----------------
function login() {
  const phone = document.getElementById("loginPhone").value;
  const pin = document.getElementById("loginPin").value;
  const user = JSON.parse(localStorage.getItem(phone));

  if (user && user.pin === pin) {
    localStorage.setItem("currentUser", phone);
    location.href = "ai_selection.html";
  } else {
    alert("Invalid phone or PIN.");
  }
}

// ---------------- CREATE ACCOUNT ----------------
function createAccount() {
  const name = document.getElementById("newName").value;
  const phone = document.getElementById("newPhone").value;
  const pin = document.getElementById("newPin").value;

  if (!name || !phone || !pin) {
    alert("Please fill all fields.");
    return;
  }

  localStorage.setItem(phone, JSON.stringify({ name, phone, pin }));
  alert("Account created successfully!");
  location.href = "index.html";
}

// ---------------- RESET PIN ----------------
function resetPin() {
  const phone = document.getElementById("resetPhone").value;
  const newPin = document.getElementById("resetPin").value;
  const user = JSON.parse(localStorage.getItem(phone));

  if (user) {
    user.pin = newPin;
    localStorage.setItem(phone, JSON.stringify(user));
    alert("PIN updated successfully!");
    location.href = "index.html";
  } else {
    alert("User not found.");
  }
}

// ---------------- SELECT AI ----------------
function selectAI(aiName) {
  localStorage.setItem("selectedAI", aiName);
  location.href = "chat.html";
}

// ---------------- CHAT ----------------
async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const message = input.value.trim();
  const aiName = localStorage.getItem("selectedAI") || "Theo";

  if (!message) return;

  chatBox.innerHTML += `<div class="msg user">You: ${message}</div>`;
  input.value = "";
  input.focus();

  const reply = await mockAIResponse(message, aiName);
  chatBox.innerHTML += `<div class="msg ai">${reply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function mockAIResponse(message, aiName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${aiName}: ${message.split('').reverse().join('')}`);
    }, 700);
  });
}

function logout() {
  localStorage.removeItem("currentUser");
  location.href = "index.html";
}
