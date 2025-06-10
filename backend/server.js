require('dotenv').config();
const http = require('http');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const mainRoutes= require('./src/routes/index');
require('./src/config/passport');

const app = express();
const server = http.createServer(app);
const { Server: SocketServer } = require('socket.io');
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});
const PORT = process.env.PORT || 3000;

//middleware
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration (espress-session)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Register all routes
app.use('/api', mainRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// root route FOR NOW(Change after frontend created)
app.get('/', (req, res) => {
  res.send('API Server is running. No frontend is connected.');
});


// Protected route example
app.get('/api/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.user });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server + WebSockets running on http://localhost:${PORT}`);
});