const socketIoService = require("../service/socket.io.service")

exports.connectSocketIo = (io) => {
    io.on('connection', socket => {
        console.log('connected');

        socket.on('join', ({name, room}, callback) => {

            const {error, user} = socketIoService.addUser({id: socket.id, name, room});

            if (error) return callback(error);

            socket.emit('message', {
                user: 'admin',
                text: `Chào mừng đến với phòng ${user.name}!`
            });

            socket.broadcast.to(user.room).emit('message', {
                user: 'admin',
                text: `${user.name} Vào phòng!`
            });

            socket.join(user.room);

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: socketIoService.getUsersInRoom(user.room)
            });

            callback();
        });

        socket.on('sendMessage', (message, callback) => {
            const user = socketIoService.getUser(socket.id);

            io.to(user.room).emit('message', {
                user: user.name,
                text: message
            });

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: socketIoService.getUsersInRoom(user.room)
            });

            callback();
        });

        socket.on('disconnect', () => {
            const user = socketIoService.removeUser(socket.id);

            if (user)
                io.to(user.room).emit('message', {
                    user: 'admin',
                    text: `${user.name} đã rời phòng`
                });
            console.log('Một người dùng đã ngắt kết nối.');
        })
    });
}