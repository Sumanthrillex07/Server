const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const users = {};
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("join", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} join room: ${data}`);
  });
  socket.on("identity",(name)=>{
    users[socket.id] = { name };
    console.log(name);
    socket.broadcast.emit("user",name);
  })
  socket.on("send", async (data) => {
    // console.log(data);
    await socket.to(data.room).emit("receive", data);
  });
  socket.on("disconnect", () => {
    console.log("User left", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server Running");
});
