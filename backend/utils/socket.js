let io;
const userSockets = new Map();

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: '*', // Di production, ganti dengan URL frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('register', (userId) => {
        userSockets.set(userId.toString(), socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      });

      socket.on('disconnect', () => {
        for (const [userId, socketId] of userSockets.entries()) {
          if (socketId === socket.id) {
            userSockets.delete(userId);
            console.log(`User ${userId} unregistered`);
            break;
          }
        }
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
  getUserSocket: (userId) => {
    return userSockets.get(userId.toString());
  }
};
