// var express = require('express');
// var router = express.Router();
// const mongoose = require('mongoose');
// require('../../models/Message');
// const Message = mongoose.model("Message");
//
// router.get('/api/messages', async (req, res) => {
//     const { sender, receiver } = req.query; // Lấy thông tin từ query parameters
//
//     try {
//         const messages = await Message.find({
//             $or: [
//                 { sender, receiver },
//                 { sender: receiver, receiver: sender }
//             ]
//         }).sort({ timestamp: 1 }); // Sắp xếp tin nhắn theo thời gian
//         res.json(messages);
//     } catch (error) {
//         res.status(500).json({ error: 'Lỗi khi lấy lịch sử chat' });
//     }
// });
//
// module.exports = (io) => {
//     const users = {}; // Lưu trữ danh sách người dùng kết nối (key: userID, value: socketID)
//
//     io.on('connection', (socket) => {
//         console.log('Người dùng kết nối:', socket.id);
//
//         // Xử lý sự kiện khi người dùng đăng nhập hoặc kết nối với ID
//         socket.on('register', (userID) => {
//             users[userID] = socket.id; // Map userID với socketID
//             console.log('Người dùng đã đăng ký:', userID);
//         });
//
//         // Nhận tin nhắn 1-1
//         socket.on('send_message', async (data) => {
//             const { sender, receiver, message } = data;
//             console.log(`Tin nhắn từ ${sender} tới ${receiver}: ${message}`);
//
//             // Lưu tin nhắn vào MongoDB
//             try {
//                 const newMessage = new Message({ sender, receiver, message });
//                 await newMessage.save();
//                 console.log('Tin nhắn đã lưu vào DB');
//             } catch (error) {
//                 console.error('Lỗi khi lưu tin nhắn:', error);
//             }
//
//             // Gửi tin nhắn tới người nhận nếu họ đang online
//             const receiverSocketID = users[receiver];
//             if (receiverSocketID) {
//                 io.to(receiverSocketID).emit('receive_message', data);
//             }
//         });
//
//         // Xử lý khi người dùng ngắt kết nối
//         socket.on('disconnect', () => {
//             console.log('Người dùng đã thoát:', socket.id);
//             // Xóa user khỏi danh sách
//             for (const userID in users) {
//                 if (users[userID] === socket.id) {
//                     delete users[userID];
//                     break;
//                 }
//             }
//         });
//     });
// };


// chatRouter.js
const express = require('express');
const router = express.Router();
const http = require('http');
const socketIO = require('socket.io');
const WebSocket = require('ws');
const url = require('url');

const wss = new WebSocket.Server({ port: 8080 });

module.exports = function(server) {
    const io = socketIO(server);

    wss.on('connection', (wss) => {

        console.log('User connected');

        // Handle user joining the chat
        wss.on('join', (userNickname) => {
            console.log(`${userNickname} has joined the chat`);
            wss.broadcast.emit('userjoinedthechat', `${userNickname} has joined the chat`);
        });

        // Handle message detection
        wss.on('messagedetection', (senderNickname, messageContent) => {
            console.log(`${senderNickname}: ${messageContent}`);

            const message = {
                message: messageContent,
                senderNickname: senderNickname,
            };

            wss.emit('message', message);
        });

        // Handle disconnect
        wss.on('disconnect', () => {
            console.log('User has left');
            socket.broadcast.emit('userdisconnect', 'User has left');
        });

    });

    return router;
};
