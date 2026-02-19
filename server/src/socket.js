const { Server } = require('socket.io');

const handleJoinRoom = (socket, room) => {
    console.log(`Socket ${socket.id} joined room ${room}`);
    socket.join(room);
};

const handleDisconnect = (socket) => {
    console.log(`Socket ${socket.id} disconnected`);
};

const handleConnection = (io) => (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on('join_inventory', (room) => handleJoinRoom(socket, room));
    socket.on('disconnect', () => handleDisconnect(socket));
};

exports.initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', handleConnection(io));
    return io;
};
