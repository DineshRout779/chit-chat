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
const User = require('./models/User');
const Chat = require('./models/Chat');
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
  let connectedUserId;
  socket.on('setup', async (userData) => {
    connectedUserId = userData._id;
    console.log('User connected: ', connectedUserId + ' ✅');
    socket.join(connectedUserId);

    await User.findByIdAndUpdate(connectedUserId, { status: 'Online' });

    io.to(connectedUserId).emit('conn', connectedUserId);
  });

  let roomJoined;

  // Handle room join
  socket.on('joinChat', (room) => {
    roomJoined = room;
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });

  socket.on('new message', async (newMessageRecieved) => {
    // console.log('message received 📄', newMessageRecieved);

    const { chatId } = newMessageRecieved;

    const chat = await Chat.findById(chatId).populate('users', '-password');

    // console.log('chat users: ', chat.users);

    chat.users.forEach((u) => {
      console.log(u._id, connectedUserId);
      if (u._id.toString() === connectedUserId) return;

      io.to(u._id.toString()).emit('message received', newMessageRecieved);
    });
    // socket.to(roomJoined).emit('message received', newMessageRecieved);
  });

  // typing
  socket.on('typing', (room) => {
    socket.to(roomJoined).emit('typing');
  });

  // stop typing
  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing');
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('======disconnected=======', connectedUserId, '❌');
    socket.to(connectedUserId).emit('disconnected');
  });
});

server.listen(3000, () => {
  console.log(
    '----------------------------------------\nServer running at http://localhost:3000'
  );
});
