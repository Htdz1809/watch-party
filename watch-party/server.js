const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  
  // 1. الفيديو
  socket.on("change_video", (videoId) => {
    io.emit("server_change_video", videoId);
  });

  socket.on("play_video", () => {
    socket.broadcast.emit("server_play");
  });

  socket.on("pause_video", () => {
    socket.broadcast.emit("server_pause");
  });

  socket.on("sync_time", (time) => {
    socket.broadcast.emit("server_sync_time", time);
  });

  // 2. الدردشة (الجديد)
  socket.on("send_msg", (data) => {
    // data تحتوي على: { name: "Ahmed", msg: "hello" }
    io.emit("receive_msg", data); // إرسال الرسالة للجميع
  });

});

const listener = http.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});