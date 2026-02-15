let chats = JSON.parse(localStorage.getItem("chats")) || [];
let currentChat = null;

const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");
const prompt = document.getElementById("prompt");

function save() {
  localStorage.setItem("chats", JSON.stringify(chats));
}

function renderChats() {
  chatList.innerHTML = "";
  chats.forEach((chat, i) => {
    const div = document.createElement("div");
    div.className = "chat-item";
    div.textContent = chat.title;
    div.onclick = () => openChat(i);
    chatList.appendChild(div);
  });
}

function openChat(i) {
  currentChat = i;
  messages.innerHTML = "";
  chats[i].messages.forEach(m => addMessage(m.text, m.role));
}

function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

document.getElementById("newChat").onclick = () => {
  chats.unshift({ title: "New chat", messages: [] });
  currentChat = 0;
  save();
  renderChats();
  messages.innerHTML = "";
};

document.getElementById("send").onclick = () => {
  if (!prompt.value.trim()) return;

  const text = prompt.value;
  prompt.value = "";

  chats[currentChat].messages.push({ role: "user", text });
  addMessage(text, "user");

  // fake bot reply (yerine Make.com koyarsın)
  setTimeout(() => {
    const reply = "Bot cevabı burada.";
    chats[currentChat].messages.push({ role: "bot", text: reply });
    addMessage(reply, "bot");
    save();
  }, 500);

  save();
};

renderChats();
