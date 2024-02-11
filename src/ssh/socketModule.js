const { sshConnect, doCommand } = require('@/ssh');
const socketIO = require('socket.io');

module.exports = (server) => {
    sshConnect();

    const io = socketIO(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('command', async (command) => {
            console.log('command', command);
            const result = await doCommand(command);
            console.log('result', result);
            socket.emit('commandResult', result);
        });

        socket.on("newMessage", (message) => {
            console.log("newMessage:", message);
            socket.emit("messageResponse", "I don't know");
        })

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            socket.removeAllListeners();
        });
    });
}