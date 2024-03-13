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
const port = process.env.PORT || 3000;
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
  let roomJoined;

  // setup: When a user logs in make a room,
  socket.on('setup', async (userData) => {
    connectedUserId = userData._id;
    console.log('======connected=======', connectedUserId, '✅');
    socket.join(connectedUserId);

    // update active status in DB
    await User.findByIdAndUpdate(connectedUserId, { status: 'Online' });

    //
    io.except(connectedUserId).emit('userOnline', connectedUserId);
    io.to(connectedUserId).emit('conn', connectedUserId);
  });

  // When a user joins a room (selects an user for chat) ==> Join them in a common room
  socket.on('joinChat', (room) => {
    roomJoined = room;
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });

  // handle incoming messages
  socket.on('new message', async (newMessageRecieved) => {
    // console.log('message received 📄', newMessageRecieved);

    // send the incoming message to users in the room except the one who sent
    const { chatId } = newMessageRecieved;
    const chat = await Chat.findById(chatId).populate('users', '-password');
    chat.users.forEach((u) => {
      if (u._id.toString() === connectedUserId) return;

      io.to(u._id.toString()).emit('message received', newMessageRecieved);
    });
  });

  // typing indicator
  socket.on('typing', (room) => {
    socket.to(roomJoined).emit('typing');
  });

  // stop typing indicator
  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing');
  });

  // Handle user disconnection
  socket.on('disconnect', async () => {
    console.log('======disconnected=======', connectedUserId, '❌');

    // update active status in DB
    await User.findByIdAndUpdate(connectedUserId, { status: 'Offline' });

    // emit offline status to all users except the one who left
    io.except(connectedUserId).emit('userOffline', connectedUserId);

    // disconnect from own room
    socket.to(connectedUserId).emit('disconnected');
  });
});

server.listen(port, () => {
  console.log(
    `------------------------------------------------------\nServer running at http://localhost:${port}`
  );
});
