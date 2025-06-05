const socketIoService = require("../service/socket.io.service");

// const connectSocketIo = (io) => {
//     io.on('connection', socket => {
//         console.log('connected');
//         socket.on('join', (options) => {
//             const { error, user } = addUser({ id: socket.id,  ...options})
//             if (error || !user) {
//                 // return callback(error)
//                 console.log(error)
//                 return
//             }
//             socket.join(user.room)
//             socket.emit('message', generateMessage('Admin', 'Welcome!'))
//             socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} Đã vào!`))
//             io.to(user.room).emit('roomData', {
//                 room: user.room,
//                 users: getUsersInRoom(user.room)
//             })
//         })
//
//         socket.on('sendMessage', (message) => {
//             const user = getUser(socket.id)
//
//             io.to(user.room).emit('message', generateMessage(user.username, message))
//         })
//
//         socket.on('sendLocation', (coords) => {
//             const user = getUser(socket.id)
//             io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
//         })
//
//         socket.on('sendNewOrder', (coords) => {
//             const user = getUser(socket.id)
//             io.to(user.room).emit('newOderMessage', generateMessage(user.username, coords.id))
//         })
//
//         socket.on('disconnect', () => {
//             const user = removeUser(socket.id)
//
//             if (user) {
//                 io.to(user.room).emit('message', generateMessage('Admin', `${user.username} Đã rời!`))
//                 io.to(user.room).emit('roomData', {
//                     room: user.room,
//                     users: getUsersInRoom(user.room)
//                 })
//             }
//         })
//     });
//
//     //message model service
//     const generateMessage = (username, text) => {
//         return {
//             username,
//             text,
//             createdAt: new Date().getTime()
//         }
//     }
//
//     const generateLocationMessage = (username, url) => {
//         return {
//             username,
//             url,
//             createdAt: new Date().getTime()
//         }
//     }
//
//     //user model service
//     const users = []
//
//     const addUser = ({ id, username, room }) => {
//         username = username.trim().toLowerCase()
//         room = room.trim().toLowerCase()
//
//         if (!username || !room) {
//             return {
//                 error: 'Tên người dùng và phòng là bắt buộc!'
//             }
//         }    const existingUser = users.find((user) => {
//             return user.room === room && user.username === username
//         })
//
//         if (existingUser) {
//             return {
//                 error: 'Tên người dùng đã được sử dụng!'
//             }
//         }
//
//         const user = { id, username, room }
//         users.push(user)
//         return { user }
//     }
//
//     const removeUser = (id) => {
//         const index = users.findIndex((user) => user.id === id)
//
//         if (index !== -1) {
//             return users.splice(index, 1)[0]
//         }
//     }
//
//     const getUser = (id) => {
//         return users.find((user) => user.id === id)
//     }
//
//     const getUsersInRoom = (room) => {
//         room = room.trim().toLowerCase()
//         return users.filter((user) => user.room === room)
//     }
// }

const channels = new Map();

const connectSocketIo = (io) => {
    io.on('connection', socket => {
        console.log(`Connection : SocketId = ${socket.id}`)
        let userName = '';
        socket.on('subscribe', function(data) {
            console.log('subscribe trigger')
            const room_data = JSON.parse(data)
            userName = room_data.userName;
            const roomName = room_data.roomName;

            socket.join(`${roomName}`)
            console.log(`Username : ${userName} joined Room Name : ${roomName}`)

            io.to(`${roomName}`).emit('newUserToChatRoom',userName);
        })

        socket.on('joinChatOne', function(data) {
            const channelID = getChannelID(data.senderId, data.receiverId);
            if (!channelID) {
                socket.disconnect();
            }
            if (!channels.has(channelID)) {
                channels.set(channelID, new Set());
            }
            channels.get(channelID).add(socket);
            // io.to(`${channelID}`).emit('newUserToChatOne',data.receiverId);
            socket.broadcast.to(`${channelID}`).emit('newUserToChatOne',data.receiverId)
            socket.join(`${channelID}`)
        })

        socket.on('leftChatOne',function(data) {
            const channelID = getChannelID(data.senderId, data.receiverId);

            // const room_data = JSON.parse(data)
            // const userName = channelID.receiverId;
            // const roomName = room_data.roomName;

            console.log(`Username : ${channelID.receiverId} leaved Room Name : ${channelID}`)
            socket.broadcast.to(`${channelID}`).emit('userLeftChatOne',data.receiverId)
            socket.leave(`${channelID}`)
        })

        socket.on('sendChatOne', (data) => {
            const channelID = getChannelID(data.senderId, data.receiverId);
            console.log(`Received message in channel ${channelID}:`, data.message);
            broadcastMessage(channelID, data.message, data.senderId);
        });

        socket.on('unsubscribe',function(data) {
            console.log('unsubscribe trigged')
            const room_data = JSON.parse(data)
            const userName = room_data.userName;
            const roomName = room_data.roomName;

            console.log(`Username : ${userName} leaved Room Name : ${roomName}`)
            socket.broadcast.to(`${roomName}`).emit('userLeftChatRoom',userName)
            socket.leave(`${roomName}`)
        })

        socket.on('newMessage',function(data) {
            console.log('newMessage triggered')

            const messageData = JSON.parse(data)
            const messageContent = messageData.messageContent
            const roomName = messageData.roomName

            console.log(`[Room Number ${roomName}] ${userName} : ${messageContent}`)

            const chatData = {
                userName : userName,
                messageContent : messageContent,
                roomName : roomName
            }
            socket.broadcast.to(`${roomName}`).emit('updateChat',JSON.stringify(chatData))
        })

        socket.on('disconnect', function () {
            console.log("One of sockets disconnected from our server.")
        });
    });


    function getChannelID(userId, partnerId) {
        const sortedIds = [userId, partnerId].sort();
        return sortedIds.join('-');
    }

    function broadcastMessage(channelID, message, userId) {
        if (!channels.has(channelID)) return;
        channels.get(channelID).forEach(client => {
            let messageToSend = { "id": userId, "message": message };
            client.broadcast.to(`${channelID}`).emit('message', messageToSend);
        });
    }
}



module.exports = {connectSocketIo};