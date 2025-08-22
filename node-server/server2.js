const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
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

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle offer
    socket.on('offer', (offer) => {
        console.log('Received offer:', offer);
        socket.broadcast.emit('offer', offer);  // Send offer to other peer
    });

    // Handle answer
    socket.on('answer', (answer) => {
        console.log('Received answer:', answer);
        socket.broadcast.emit('answer', answer);  // Send answer to the other peer
    });

    // Handle ICE candidate
    socket.on('ice-candidate', (candidate) => {
        console.log('Received ICE candidate:', candidate);
        socket.broadcast.emit('ice-candidate', candidate);  // Send candidate to the other peer
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('WebRTC server is running');
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
