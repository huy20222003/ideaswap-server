import { Server } from 'socket.io';
import Messages from './app/models/Messages.mjs';
import cloudinary from './config/cloudinary/index.mjs'; // Import cloudinary configuration

const setUpSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173'],
      methods: ['GET', 'POST'],
    },
  });

  const userSocketMap = new Map();
  let onlineUsers = []; // Array to store online user IDs

  const disconnect = (socket) => {
    console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        // Remove userId from onlineUsers array
        onlineUsers = onlineUsers.filter((id) => id !== userId);
        break;
      }
    }
    // Log updated online users
    console.log('Online users:', onlineUsers);
    io.emit('onlineUsers', onlineUsers);
  };

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      // Check if userId is already in onlineUsers
      if (!onlineUsers.includes(userId)) {
        userSocketMap.set(userId, socket.id);
        onlineUsers.push(userId);
        console.log(`A user connected: ${userId} with socketId: ${socket.id}`);
      } else {
        console.log(`User ${userId} is already online`);
      }

      // Log updated online users
      console.log('Online users:', onlineUsers);
      io.emit('onlineUsers', onlineUsers);
    } else {
      console.log('ID not provided');
    }

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined conversation: ${conversationId}`);
    });

    socket.on('sendMessage', async (data) => {
      try {
        const { conversationID, content, type } = data;
        const senderID = userId; // Assuming userId is the sender's ID

        let fileUrl = '';
        let messageContent = '';

        if (type === 'file') {
          // Upload image to Cloudinary
          const uploadResult = await cloudinary.uploader.upload(content, {
            upload_preset: process.env.UPLOAD_PRESET,
          });
          // Get URL of the uploaded image
          fileUrl = uploadResult.secure_url;
        }

        // Set message content based on type
        if (type === 'text') {
          messageContent = content;
        } 

        // Save message to MongoDB
        const newMessage = new Messages({
          conversationID,
          content: type === 'text' ? messageContent : '',
          fileUrl: type === 'file' ? fileUrl : '',
          senderID,
          type,
        });
        await newMessage.save();

        // Populate senderID field
        const message = await Messages.findById(newMessage._id).populate({
          path: 'senderID',
          select: 'firstName lastName avatar',
        });
        if (!message) {
          throw new Error('Message not found after saving');
        }

        // Emit message to all members in the conversation room
        io.to(conversationID).emit('message', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => disconnect(socket));
  });

  return io;
};

export default setUpSocket;
