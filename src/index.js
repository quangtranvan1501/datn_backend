const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { Server } = require('socket.io');
const { createServer } = require('http');

let server;
global.onlineUsers = new Map();
// const onlineUsers = new Map();

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  const httpServer = createServer(app);
  // server = app.listen(config.port, () => {
  //   logger.info(`Listening to port ${config.port}`);
  // });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    global.chatSocket = socket;
    logger.info('Socket connected');
    socket.on('add-user', ({ userId, role }) => {
      socket.userId = userId;
      const socketIds = onlineUsers.get(userId)?.socketIds || [];
      socketIds.push(socket.id);
      onlineUsers.set(userId, { socketIds, role });

      console.log(onlineUsers);
      logger.info('add-user', onlineUsers);
    });

    socket.on('send-msg', (data) => {
      logger.info('send-msg', data);
      console.log(data);
      const { to, message } = data;
      const toSocketIds = onlineUsers.get(to)?.socketIds || [];
      const senderSocketIds = onlineUsers.get(socket.userId)?.socketIds || [];
      const allSocketIds = [...toSocketIds, ...senderSocketIds];
      console.log('all', allSocketIds);
      console.log('sender', senderSocketIds);
      console.log('to', toSocketIds);
      console.log('socket', socket.userId);
      allSocketIds.forEach((socketId) => {
        io.to(socketId).emit('receive-msg', { from: socket.userId, message });
        console.log(socket.userId);
      });
    });

    socket.on('disconnect', () => {
      onlineUsers.forEach((value, key) => {
        const socketIds = value.socketIds.filter((id) => id !== socket.id);
        if (socketIds.length) {
          onlineUsers.set(key, { socketIds, role: value.role });
        } else {
          onlineUsers.delete(key);
        }
      });
    });
  });
  httpServer.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
