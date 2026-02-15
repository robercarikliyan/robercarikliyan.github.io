let chats = JSON.parse(localStorage.getItem("chats")) || [];
let activeChatId = localStorage.getItem("activeChatId") || null;

const chatList = document.getElementById("chatList");
const messagesEl = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChat");

function save() {
  localStorage.setItem("chats", JSON.stringify(chats));
  localStorage.setItem("activeChatId", activeChatId);
}

function renderChats() {
  chatList.innerHTML = "";
  chats.forEach(chat => {
    const li = document.createElement("li");
    li.textContent = chat.title;
    if (chat.id === activeChatId) li.classList.add("active");
    li.onclick = () => {
      activeChatId = chat.id;
      save();
      render();
    };
    chatList.appendChild(li);
  });
}

function renderMessages() {
  messagesEl.innerHTML = "";
  const chat = chats.find(c => c.id === activeChatId);
  if (!chat) return;

  chat.messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = `message ${msg.role}`;
    div.textContent = msg.content;
    messagesEl.appendChild(div);
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function render() {
  renderChats();
  renderMessages();
}

function newChat() {
  const chat = {
    id: Date.now().toString(),
    title: "New chat",
    messages: []
  };
  chats.unshift(chat);
  activeChatId = chat.id;
  save();
  render();
}

function sendMessage() {
  const text = input.value.trim();
  if (!text || !activeChatId) return;

  const chat = chats.find(c => c.id === activeChatId);

  chat.messages.push({ role: "user", content: text });

  if (chat.messages.length === 1) {
    chat.title = text.slice(0, 20);
  }

  input.value = "";
  save();
  render();

  // FAKE ASSISTANT RESPONSE (yerine API / webhook bağlanacak)
  setTimeout(() => {
    chat.messages.push({
      role: "assistant",
      content: "Bu bir placeholder cevap. Buraya AI bağlanacak."
    });
    save();
    render();
  }, 600);
}

sendBtn.onclick = sendMessage;

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

newChatBtn.onclick = newChat;

if (!chats.length) {
  newChat();
} else {
  render();
}
