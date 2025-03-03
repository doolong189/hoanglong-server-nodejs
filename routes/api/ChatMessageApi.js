var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../../models/Message')
require('../../models/Chat')
const Message = mongoose.model("message");
const Chat = mongoose.model("chat")

router.post("/createChatMessage", async (req, res) => {
    try {
        const { chatId,messageImage, messageText, senderId, timestamp } = req.body;

        let chat = await Chat.findOne({ chatId });

        if (!chat) {
            chat = new Chat({ chatId, messages: [], lastMsg: "", lastMsgTime: 0 });
        }

        // Tạo tin nhắn mới trong collection Message
        const newMessage = await Message.create({messageImage, messageText, senderId, timestamp });

        // Lưu ObjectId của message vào Chat
        chat.messages.push(newMessage._id);
        chat.lastMsg = messageText;
        chat.lastMsgTime = timestamp;

        await chat.save();
        res.json({ message: "Thêm tin nhắn mới thành công" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Lỗi server" });
    }
});


router.post("/getChatMessages", async (req, res) => {
    try {
        const { chatId } = req.body;

        if (!chatId) {
            return res.json({ success: false, message: "Chat ID is required" });
        }

        const chat = await Chat.findOne({ chatId }).populate("messages");

        if (!chat) {
            return res.json({ message: "No chat found" } );
        }

        res.json({ message: "Lấy dữ liệu thành công", chats: chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
