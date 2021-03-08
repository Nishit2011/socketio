const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const getMessageTime = require("./utility/chat");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utility/users");

const app = express();

const server = http.createServer(app);
const io = socketio(server);

const pathDir = path.join(__dirname, "../public");
app.use(express.static(pathDir));

io.on("connection", (socket) => {
  socket.on("join", (val, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username: val.username,
      room: val.room,
    });
    if (error) return callback(error);

    socket.join(user.room);

    socket.emit("message", getMessageTime("Admin", "Welcome to chat app!!"));
    socket.broadcast
      .to(user.room)
      .emit("message", getMessageTime(`${user.username} has joined`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (msg, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", getMessageTime(user.username, msg));
    callback("Message received");
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        getMessageTime("Admin", `${user.username} has left!`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(3100, () => {
  console.log("Server is listening on 3100");
});
