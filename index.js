const dotnev = require('dotenv');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoute');
const chatRoute = require('./routes/chatRoutes');
const connectDB = require('./configs/db');
dotnev.config();

// app initialization
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// setup middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Database connection
connectDB();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chats', chatRoute);

// ---------- socket -------------- //
io.on('connection', (socket) => {
  socket.on('setup', (userData) => {
    console.log('User connected: ', userData._id + ' ✅');
    socket.join(userData._id);
    io.emit('connected', userData._id);
  });

  let roomJoined;

  // Handle room join
  socket.on('joinChat', (room) => {
    roomJoined = room;
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });

  socket.on('new message', async (newMessageRecieved) => {
    socket.to(roomJoined).emit('message received', newMessageRecieved);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected ❌');
  });
});

server.listen(3000, () => {
  console.log(
    '----------------------------------------\nServer running at http://localhost:3000'
  );
});
