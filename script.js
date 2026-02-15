// ELEMENTS
const chatList = document.getElementById("chatList");
const messagesEl = document.getElementById("messages");
const promptEl = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");

// STATE
let chats = JSON.parse(localStorage.getItem("chats")) || [];
let currentChatId = localStorage.getItem("currentChatId") || null;

// UTIL
function saveState() {
  localStorage.setItem("chats", JSON.stringify(chats));
  localStorage.setItem("currentChatId", currentChatId);
}

function generateId() {
  return Date.now().toString();
}

// CHAT MANAGEMENT
function createNewChat() {
  const id = generateId();
  const chat = {
    id,
    title: "Yeni Sohbet",
    messages: [],
    createdAt: Date.now()
  };
  chats.unshift(chat);
  currentChatId = id;
  saveState();
  renderChats();
  renderMessages();
}

function deleteChat(id) {
  chats = chats.filter(c => c.id !== id);
  if (currentChatId === id) {
    currentChatId = chats.length ? chats[0].id : null;
  }
  saveState();
  renderChats();
  renderMessages();
}

function getCurrentChat() {
  return chats.find(c => c.id === currentChatId) || null;
}

// RENDER
function renderChats() {
  chatList.innerHTML = "";

  chats.forEach(chat => {
    const item = document.createElement("div");
    item.className = "chat-item" + (chat.id === currentChatId ? " active" : "");

    const title = document.createElement("span");
    title.className = "chat-title";
    title.textContent = chat.title;

    const del = document.createElement("button");
    del.className = "chat-delete-btn";
    del.textContent = "🗑";

    del.onclick = (e) => {
      e.stopPropagation();
      deleteChat(chat.id);
    };

    item.onclick = () => {
      currentChatId = chat.id;
      saveState();
      renderChats();
      renderMessages();
    };

    item.appendChild(title);
    item.appendChild(del);
    chatList.appendChild(item);
  });
}

function renderMessages() {
  messagesEl.innerHTML = "";
  const chat = getCurrentChat();
  if (!chat) return;

  chat.messages.forEach(msg => {
    addMessageToDOM(msg.role, msg.content);
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// MESSAGE
function addMessage(role, content) {
  const chat = getCurrentChat();
  if (!chat) return;

  chat.messages.push({ role, content });

  if (chat.messages.length === 1 && role === "user") {
    chat.title = content.slice(0, 30);
  }

  saveState();
  renderChats();
  addMessageToDOM(role, content);
}

function addMessageToDOM(role, content) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}`;

  if (role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    wrapper.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;

  wrapper.appendChild(bubble);
  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// SEND
function sendMessage() {
  const text = promptEl.value.trim();
  if (!text) return;
  if (!getCurrentChat()) createNewChat();

  addMessage("user", text);
  promptEl.value = "";
  
   fetch("https://hook.eu1.make.com/r04fdt4l529fdupb11uppfcstdx5ynx6", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ input: text })
   })
   .then(res => res.json())
   .then(data => {
     addMessage("assistant", data.output || "Yanıt alınamadı");
   })
   .catch(() => {
     addMessage("assistant", "Bir hata oluştu.");
   });

  // geçici dummy cevap
  setTimeout(() => {
    addMessage("assistant", "Yanıt burada görünecek.");
  }, 500);
}

// EVENTS
sendBtn.onclick = sendMessage;

promptEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

newChatBtn.onclick = createNewChat;

// INIT
if (!chats.length) {
  createNewChat();
} else if (!currentChatId || !getCurrentChat()) {
  currentChatId = chats[0].id;
  saveState();
}

renderChats();
renderMessages();
