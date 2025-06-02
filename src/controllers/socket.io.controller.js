const socketIoService = require("../service/socket.io.service");

const connectSocketIo = (io) => {
    io.on('connection', socket => {
        console.log('connected');
        socket.on('join', (options) => {
            const { error, user } = addUser({ id: socket.id,  ...options})
            if (error || !user) {
                // return callback(error)
                console.log(error)
                return
            }
            socket.join(user.room)
            socket.emit('message', generateMessage('Admin', 'Welcome!'))
            socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} Đã vào!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        })

        socket.on('sendMessage', (message) => {
            const user = getUser(socket.id)

            io.to(user.room).emit('message', generateMessage(user.username, message))
        })

        socket.on('sendLocation', (coords) => {
            const user = getUser(socket.id)
            io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        })

        socket.on('sendNewOrder', (coords) => {
            const user = getUser(socket.id)
            io.to(user.room).emit('newOderMessage', generateMessage(user.username, coords.id))
        })

        socket.on('disconnect', () => {
            const user = removeUser(socket.id)

            if (user) {
                io.to(user.room).emit('message', generateMessage('Admin', `${user.username} Đã rời!`))
                io.to(user.room).emit('roomData', {
                    room: user.room,
                    users: getUsersInRoom(user.room)
                })
            }
        })
    });

    //message model service
    const generateMessage = (username, text) => {
        return {
            username,
            text,
            createdAt: new Date().getTime()
        }
    }

    const generateLocationMessage = (username, url) => {
        return {
            username,
            url,
            createdAt: new Date().getTime()
        }
    }

    //user model service
    const users = []

    const addUser = ({ id, username, room }) => {
        username = username.trim().toLowerCase()
        room = room.trim().toLowerCase()

        if (!username || !room) {
            return {
                error: 'Tên người dùng và phòng là bắt buộc!'
            }
        }    const existingUser = users.find((user) => {
            return user.room === room && user.username === username
        })

        if (existingUser) {
            return {
                error: 'Tên người dùng đã được sử dụng!'
            }
        }

        const user = { id, username, room }
        users.push(user)
        return { user }
    }

    const removeUser = (id) => {
        const index = users.findIndex((user) => user.id === id)

        if (index !== -1) {
            return users.splice(index, 1)[0]
        }
    }

    const getUser = (id) => {
        return users.find((user) => user.id === id)
    }

    const getUsersInRoom = (room) => {
        room = room.trim().toLowerCase()
        return users.filter((user) => user.room === room)
    }
}

module.exports = {connectSocketIo};