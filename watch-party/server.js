const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

// 1. مكان حفظ الرسائل (ذاكرة مؤقتة)
let messageHistory = []; 

io.on("connection", (socket) => {
  
  // 2. أول ما يدخل الشخص، نرسل له الرسائل القديمة
  socket.emit("load_history", messageHistory);

  // --- أوامر الفيديو ---
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

  // --- أوامر الدردشة ---
  socket.on("send_msg", (data) => {
    // 3. حفظ الرسالة في الذاكرة
    messageHistory.push(data);
    
    // (اختياري) نحتفظ بآخر 50 رسالة فقط حتى لا يمتلئ السيرفر
    if (messageHistory.length > 50) {
      messageHistory.shift();
    }

    // إرسال للكل
    io.emit("receive_msg", data);
  });

});

const listener = http.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});
