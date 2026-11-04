const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const sendBtn = document.getElementById("sendBtn");
const connectionText = document.getElementById("connectionText");

function addMessage(role, text, extraClass = "") {
  welcome.hidden = true;
  const row = document.createElement("div");
  row.className = `message ${role}`;
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = role === "user" ? "Y" : "H";
  const bubble = document.createElement("div");
  bubble.className = `bubble ${extraClass}`;
  bubble.textContent = text;
  row.append(avatar, bubble);
  messages.appendChild(row);
  row.scrollIntoView({ behavior: "smooth", block: "end" });
  return bubble;
}

async function sendMessage(text) {
  const clean = text.trim();
  if (!clean || sendBtn.disabled) return;
  addMessage("user", clean);
  input.value = "";
  input.style.height = "auto";
  sendBtn.disabled = true;
  const pending = addMessage("assistant", "HEX is thinking…", "typing");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: clean })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    pending.classList.remove("typing");
    pending.textContent = data.reply;
  } catch (error) {
    pending.classList.remove("typing");
    pending.classList.add("error");
    pending.textContent = error.message || "Unable to reach HEX AI.";
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage(input.value);
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 150)}px`;
});
input.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

document.querySelectorAll("[data-prompt]").forEach(button => {
  button.addEventListener("click", () => sendMessage(button.dataset.prompt));
});

function clearChat() {
  messages.replaceChildren();
  welcome.hidden = false;
  input.focus();
}
document.getElementById("clearBtn").addEventListener("click", clearChat);
document.getElementById("newChatBtn").addEventListener("click", clearChat);
document.getElementById("mobileNewChat").addEventListener("click", clearChat);

fetch("/api/health")
  .then(response => response.json())
  .then(data => {
    connectionText.textContent = data.aiConfigured ? "AI engine connected" : "API key needed";
    if (!data.aiConfigured) connectionText.style.color = "#e9b86c";
  })
  .catch(() => {
    connectionText.textContent = "Server unavailable";
    connectionText.style.color = "#ff9aab";
  });