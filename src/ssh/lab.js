import { findLab } from '../utils/labs.js';
import { createSshConnection } from '../utils/ssh.js';
import { SSH_HOST, SSH_PORT, SSH_USER, SSH_PASS } from '../config/index.js';
import { onRequestSsh } from './machine.js';
import { onChatMessage } from './chat.js';

export const onLabStart = async (socket, labName) => {
  const lab = await findLab(labName);

  if (!lab) {
    return socket.emit('labStartFailed', `Lab not found`);
  }

  let isSshConnected = true;

  const isConnected = () => isSshConnected;

  const handleChatMessage = (message) =>
    onChatMessage(socket, labName, message);

  const handleRequestSsh = (ssh) =>
    onRequestSsh(
      socket,
      {
        ssh,
        reconnect,
        isConnected,
      },
      labName
    );

  const reconnect = () => {
    return createSshConnection(
      {
        host: SSH_HOST,
        username: SSH_USER,
        password: SSH_PASS,
        port: SSH_PORT,
      },
      () => {
        socket.emit('labDisconnected', 'SSH connection closed');
        socket.off('requestSsh', () => handleRequestSsh(ssh));
        socket.off('chatMessage', handleChatMessage);
        isSshConnected = false;
      }
    );
  };

  // TODO replace with lab credentials
  const ssh = await reconnect();

  socket.on('requestSsh', () => handleRequestSsh(ssh));

  socket.on('chatMessage', handleChatMessage);

  socket.emit('labStarted', labName);
};
