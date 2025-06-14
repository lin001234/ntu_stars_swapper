import { Server } from "socket.io";
import http from "http";
import express from"express";
import { Server as SocketServer } from "socket.io";

const app = express();
const server=http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

const userSocketMap={}; // {userId:socketId}
// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New client connected',socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('Client disconnected',socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export {io,app,server};