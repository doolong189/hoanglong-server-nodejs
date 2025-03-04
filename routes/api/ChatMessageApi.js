var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../../models/Message')
require('../../models/Chat')
const Message = mongoose.model("message");
const Chat = mongoose.model("chat")

// router.post("/createChatMessage", async (req, res) => {
//     try {
//         const { chatId,messageImage, messageText, senderId, timestamp } = req.body;
//
//         let chat = await Chat.findOne({ chatId });
//
//         if (!chat) {
//             chat = new Chat({ chatId, messages: [], lastMsg: "", lastMsgTime: 0 });
//         }
//
//         // Tạo tin nhắn mới trong collection Message
//         const newMessage = await Message.create({messageImage, messageText, senderId, timestamp });
//
//         // Lưu ObjectId của message vào Chat
//         chat.messages.push(newMessage._id);
//         chat.lastMsg = messageText;
//         chat.lastMsgTime = timestamp;
//
//         await chat.save();
//         res.json({ message: "Thêm tin nhắn mới thành công" });
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ message: "Lỗi server" });
//     }
// });
//
//
// router.post("/getChatMessages", async (req, res) => {
//     try {
//         const { chatId } = req.body;
//
//         if (!chatId) {
//             return res.json({ success: false, message: "Chat ID is required" });
//         }
//
//         const chat = await Chat.findOne({ chatId }).populate("messages");
//
//         if (!chat) {
//             return res.json({ message: "No chat found" } );
//         }
//
//         res.json({ message: "Lấy dữ liệu thành công", chats: chat });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });


router.post("/createChatMessage", async (req, res) => {
    try {
        const { messageId,messageImage, messageText, senderId, receiverId, senderChatId,  timestamp } = req.body;

        let message = await Message.findOne({ messageId });

        if (!message) {
            message = new Message({ messageId , senderId : senderId, receiverId : receiverId, chats: [], lastMsg: "", lastMsgTime: 0 });
        }

        // Tạo tin nhắn mới trong collection Message
        const newChat = await Chat.create({messageImage, senderId : senderChatId, messageText, timestamp });
        console.log(newChat)

        // Lưu ObjectId của message vào Chat
        message.chats.push(newChat._id);
        message.lastMsg = messageText;
        message.lastMsgTime = timestamp;

        await message.save();
        console.log(message)
        res.json({ message: "Thêm tin nhắn mới thành công" } );
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Lỗi server" });
    }
});


router.post("/getChatMessages", async (req, res) => {
    try {
        const { messageId } = req.body;

        if (!messageId) {
            return res.json({ success: false, message: "Message ID is required" });
        }

        const mes = await Message.findOne({ messageId })
            .populate("chats")
            .populate("senderId")
            .populate("receiverId");

        if (!mes) {
            return res.json({ message: "No chat found" } );
        }

        res.json({ message: "Lấy dữ liệu thành công", messages: mes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/getHistoryChatMessages", async (req, res) => {
    try {
        const { senderId } = req.body;

        if (!senderId) {
            return res.json({ success: false, message: "Sender ID is required" });
        }

        const messages = await Message.find({ senderId })
            .populate("chats")
            .populate("senderId")
            .populate("receiverId")
            .sort({ lastMsgTime: 1 });

        if (!messages.length) {
            return res.json({message: "No messages found" });
        }

        res.json({message: "Lấy dữ liệu thành công", messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
