import { isSshConnected, sshConnect, sshConnection } from './index.js';
import { Server } from 'socket.io';

export default (server) => {
	const io = new Server(server, {
		cors: {
			origin: '*', // 'http://localhost:3000',
			methods: ['GET', 'POST']
		}
	});

	io.on('connection', async (socket) => {
		console.log('a user connected');

		if(!isSshConnected) {
			console.log('[ssh] Reconnecting');
			await sshConnect();
		}

		sshConnection.shell((err, stream) => {
			let lastCommand = null;
			if(err) {
				console.error(`[ssh] SSH error: ${err.message}`);
				return socket.emit('sshDisconnect', err.message);
			}

			socket.on('command', async (command) => {
				lastCommand = command;
				stream.write(`${command}\n`);
			});

			stream.on('data', (result) => {
				const data = result.toString('binary');
				if(data === lastCommand) {
					lastCommand = null;
				}else {
					socket.emit('commandOutput', data);
				}
			}).on('close', () => {
				sshConnection.end();
				socket.emit('sshDisconnect', 'SSH connection closed');
			});
		});

		socket.on('newMessage', (message) => {
			console.log('newMessage:', message);
			socket.emit('messageResponse', 'I don\'t know');
		});

		socket.on('disconnect', () => {
			console.log('User disconnected:', socket.id);
			socket.removeAllListeners();
		});
	});
};
