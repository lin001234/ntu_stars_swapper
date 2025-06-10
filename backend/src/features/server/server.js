const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});
const users = {};

// Import your routes
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

// Session middleware
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Share session middleware with socket.io
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Store connected users and their rooms
const connectedUsers = new Map();
const chatRooms = new Map(); // postId -> Set of socketIds

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Join a specific post chat room
    socket.on('join-post-chat', async (data) => {
        try {
            const { postId, username } = data;
            
            if (!postId) {
                socket.emit('error', 'Post ID is required');
                return;
            }
            
            // Validate post exists (you might want to add this check)
            // const post = await posts.getPostById(postId);
            // if (!post) {
            //     socket.emit('error', 'Post not found');
            //     return;
            // }
            
            const roomName = `post_${postId}`;
            
            // Get username from session or use provided username
            let userDisplayName;
            if (socket.request.user) {
                userDisplayName = socket.request.user.name || 
                                socket.request.user.user_metadata?.name || 
                                socket.request.user.email?.split('@')[0];
            } else {
                userDisplayName = username || `Anonymous_${socket.id.substring(0, 6)}`;
            }
            
            // Store user info
            connectedUsers.set(socket.id, {
                username: userDisplayName,
                userId: socket.request.user?.id || null,
                postId: postId,
                roomName: roomName,
                isAuthenticated: !!socket.request.user,
                joinedAt: new Date()
            });
            
            // Add to room tracking
            if (!chatRooms.has(postId)) {
                chatRooms.set(postId, new Set());
            }
            chatRooms.get(postId).add(socket.id);
            
            // Join the Socket.IO room
            socket.join(roomName);
            
            // Notify others in the room
            socket.to(roomName).emit('user-joined-post-chat', {
                username: userDisplayName,
                postId: postId,
                timestamp: new Date().toISOString()
            });
            
            // Send welcome message to user
            socket.emit('joined-post-chat', {
                message: `Welcome to the discussion for Post #${postId}!`,
                postId: postId,
                roomName: roomName,
                participants: chatRooms.get(postId).size
            });
            
            // Send current participants list
            const participants = Array.from(chatRooms.get(postId))
                .map(socketId => connectedUsers.get(socketId)?.username)
                .filter(Boolean);
            
            socket.emit('participants-list', {
                postId: postId,
                participants: participants,
                count: participants.length
            });
            
            console.log(`${userDisplayName} joined post chat ${postId}`);
            
        } catch (error) {
            console.error('Error joining post chat:', error);
            socket.emit('error', 'Failed to join post chat');
        }
    });
    
    // Handle post chat messages
    socket.on('send-post-message', async (data) => {
        try {
            const userInfo = connectedUsers.get(socket.id);
            
            if (!userInfo) {
                socket.emit('error', 'Please join a post chat first');
                return;
            }
            
            const { message } = data;
            
            if (!message || !message.trim()) {
                return;
            }
            
            const messageData = {
                id: Date.now() + Math.random(), // Simple ID generation
                username: userInfo.username,
                message: message.trim(),
                postId: userInfo.postId,
                timestamp: new Date().toISOString(),
                userId: userInfo.userId,
                isAuthenticated: userInfo.isAuthenticated
            };
            
            // Save message to database (optional)
            // await posts.saveChatMessage(userInfo.postId, messageData);
            
            // Broadcast message to all users in the post chat room
            io.to(userInfo.roomName).emit('post-chat-message', messageData);
            
            console.log(`Post ${userInfo.postId} - ${userInfo.username}: ${message}`);
            
        } catch (error) {
            console.error('Error sending post message:', error);
            socket.emit('error', 'Failed to send message');
        }
    });
    
    // Handle typing indicators for post chat
    socket.on('typing-in-post', () => {
        const userInfo = connectedUsers.get(socket.id);
        if (userInfo) {
            socket.to(userInfo.roomName).emit('user-typing-in-post', {
                username: userInfo.username,
                postId: userInfo.postId
            });
        }
    });
    
    socket.on('stop-typing-in-post', () => {
        const userInfo = connectedUsers.get(socket.id);
        if (userInfo) {
            socket.to(userInfo.roomName).emit('user-stopped-typing-in-post', {
                username: userInfo.username,
                postId: userInfo.postId
            });
        }
    });
    
    // Leave post chat
    socket.on('leave-post-chat', () => {
        const userInfo = connectedUsers.get(socket.id);
        if (userInfo) {
            leavePostChat(socket, userInfo);
        }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
        const userInfo = connectedUsers.get(socket.id);
        if (userInfo) {
            leavePostChat(socket, userInfo);
        }
        console.log('User disconnected:', socket.id);
    });
    
    // Helper function to handle leaving post chat
    function leavePostChat(socket, userInfo) {
        // Remove from room tracking
        if (chatRooms.has(userInfo.postId)) {
            chatRooms.get(userInfo.postId).delete(socket.id);
            
            // Clean up empty rooms
            if (chatRooms.get(userInfo.postId).size === 0) {
                chatRooms.delete(userInfo.postId);
            }
        }
        
        // Leave Socket.IO room
        socket.leave(userInfo.roomName);
        
        // Notify others in the room
        socket.to(userInfo.roomName).emit('user-left-post-chat', {
            username: userInfo.username,
            postId: userInfo.postId,
            timestamp: new Date().toISOString()
        });
        
        // Remove user info
        connectedUsers.delete(socket.id);
        
        console.log(`${userInfo.username} left post chat ${userInfo.postId}`);
    }
});

// API Routes
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Chat page route
app.get('/chat/post/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'post-chat.html'));
});

// API endpoint to get active chat rooms
app.get('/api/chat/rooms', (req, res) => {
    const activeRooms = Array.from(chatRooms.entries()).map(([postId, sockets]) => ({
        postId: parseInt(postId),
        participantCount: sockets.size,
        participants: Array.from(sockets)
            .map(socketId => connectedUsers.get(socketId)?.username)
            .filter(Boolean)
    }));
    
    res.json({ success: true, rooms: activeRooms });
});

io.on('connection', (socket) => {
    socket.on('new-user', username => {
        users[socket.id] = username;
        socket.broadcast.emit('user-connected', username);
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('message', { message: message, username: users[socket.id] });
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    })
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
});