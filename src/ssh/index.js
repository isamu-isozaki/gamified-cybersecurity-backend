import { Server } from 'socket.io';
import { onLabStart } from './lab.js';

export default (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', async (socket) => {
    console.log('[socket] connected:', socket.id);
    socket.on('labStart', (labName) => onLabStart(socket, labName));

    socket.on('disconnect', () => {
      console.log('[socket] disconnected:', socket.id);
      socket.removeAllListeners();
    });
  });
};
