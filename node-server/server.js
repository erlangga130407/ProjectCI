const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {};
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register_base_url', (baseUrl) => {
    console.log('Base URL dari client:', baseUrl);
    socket.baseUrl = baseUrl; // bisa disimpan per-socket kalau beda client beda URL
  });

  socket.on('send_message', async (data) => {
    console.log('Message:', data);
    console.log('roomid:', data.room_id);
    // io.emit('receive_message', data); // kirim ke semua user

    if (data.room_id) {
        console.log('ada:');
        io.to(data.room_id).emit('receive_message', data); // hanya kirim ke room terkait
    }

    const baseUrl = socket.baseUrl || 'http://localhost/livechat/';

    try {
      await axios.post(`${baseUrl}index.php/api/save`, data);
    } catch (err) {
      console.error('Gagal simpan:', err.message);
    }
  });

  socket.on('join-room', (roomId, userId, deviceId) => {
    if (!userId) {
        console.warn('join-room tanpa userId! Abaikan.');
        return;
    }
    console.log('roomid ini ',roomId);
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userId = userId;
    socket.deviceId = deviceId;

    if (!rooms[roomId]) rooms[roomId] = [];
    if (!rooms[roomId].includes(userId)) {
        rooms[roomId].push(userId);
    }

    // Kirim daftar user ke user baru
    socket.emit('all-users', rooms[roomId].filter(id => id !== userId));

    // Beri tahu user lain
    socket.to(roomId).emit('user-joined', userId);
  });

  // WebRTC signaling
  socket.on('offer', ({ targetId, offer }) => {
  if (io.sockets.sockets.get(targetId)) {
    io.to(targetId).emit('offer', { fromId: socket.userId, offer });
  } else {
    console.warn('Target not connected:', targetId);
  }
});

socket.on('answer', ({ targetId, answer }) => {
  if (io.sockets.sockets.get(targetId)) {
    io.to(targetId).emit('answer', { fromId: socket.userId, answer });
  } else {
    console.warn('Target not connected:', targetId);
  }
});

socket.on('ice-candidate', ({ targetId, candidate }) => {
  if (io.sockets.sockets.get(targetId)) {
    io.to(targetId).emit('ice-candidate', { fromId: socket.userId, candidate });
  } else {
    console.warn('Target not connected:', targetId);
  }
});


  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      const roomId = socket.roomId;
      const userId = socket.userId;

      if (roomId && rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter(id => id !== userId);
        socket.to(roomId).emit('user-disconnected', userId);
      }
    });

});

app.get('/', (req, res) => {
  res.send('Socket.IO server is running.');
});

server.listen(3300, () => {
  console.log('WebSocket berjalan di http://localhost:3300');
});
