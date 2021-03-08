const socket = io();

const chatForm = document.querySelector("#chat-form");
const msgTemplate = document.querySelector("#msg-template").innerHTML;

const messages = document.querySelector("#messages");
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username, room }, (error) => {});

socket.on("message", (msg) => {
  const html = Mustache.render(msgTemplate, {
    username: msg.username,
    text: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let msgVal = document.getElementById("chat-text").value;
  socket.emit("sendMessage", msgVal, (ack) => console.log(ack));
  msgVal = "";
  document.getElementById("chat-text").focus();
});
socket.on("roomData", ({ room, users }) => {
  console.log(room, users);
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});
