const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// جعل المجلد public عاماً للوصول لملف html
app.use(express.static("public"));

// التعامل مع الاتصالات
io.on("connection", (socket) => {
  console.log("مستخدم دخل الغرفة: " + socket.id);

  // 1. عند تغيير الفيديو
  socket.on("change_video", (videoId) => {
    console.log("تغيير الفيديو إلى:", videoId);
    io.emit("server_change_video", videoId); // إرسال للكل
  });

  // 2. عند التشغيل (Play)
  socket.on("play_video", () => {
    socket.broadcast.emit("server_play"); // إرسال للجميع ما عدا المرسل
  });

  // 3. عند الإيقاف (Pause)
  socket.on("pause_video", () => {
    socket.broadcast.emit("server_pause");
  });

  // 4. عند التزامن (Seek/Time update)
  socket.on("sync_time", (time) => {
    socket.broadcast.emit("server_sync_time", time);
  });
});

// تشغيل الخادم
const listener = http.listen(process.env.PORT || 3000, () => {
  console.log("التطبيق يعمل على المنفذ " + listener.address().port);
});