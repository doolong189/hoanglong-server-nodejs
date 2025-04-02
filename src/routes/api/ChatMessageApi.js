var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../../models/Message')
require('../../models/Chat')
const Message = mongoose.model("message");
const Chat = mongoose.model("chat")

router.post("/createChatMessage", async (req, res) => {
    try {
        const { messageId, messageImage, messageText, senderId, receiverId, senderChatId, timestamp } = req.body;
        let messageSender = await Message.findOne({ messageId:  senderId + receiverId });
        if (!messageSender) {
            messageSender = new Message({
                messageId: senderId + receiverId,
                senderId: senderId,
                receiverId: receiverId,
                chats: [],
                lastMsg: "",
                lastMsgTime: 0
            });
        }
        const newChatSender = await Chat.create({ messageImage, senderId: senderId, messageText, timestamp });
        messageSender.chats.push(newChatSender._id);
        messageSender.lastMsg = messageText;
        messageSender.lastMsgTime = timestamp;
        await messageSender.save();
        let messageReceiver = await Message.findOne({ messageId: receiverId + senderId });
        if (!messageReceiver) {
            messageReceiver = new Message({
                messageId : receiverId + senderId,
                senderId:  senderId,
                receiverId: receiverId,
                chats: [],
                lastMsg: "",
                lastMsgTime: 0
            });
        }
        const newChatReceiver = await Chat.create({ messageImage, senderId: senderId, messageText, timestamp });
        messageReceiver.chats.push(newChatReceiver._id);
        messageReceiver.lastMsg = messageText;
        messageReceiver.lastMsgTime = timestamp;
        await messageReceiver.save();
        console.log("newChatSender: "+newChatSender + "\n" + "messageSender: "+messageSender + "\n" + "newChatReceiver: "+newChatReceiver + "\n" + "messageReceiver: "+messageReceiver)
        res.json({ message: "Thêm tin nhắn mới thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
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
            return res.status(400).json({ message: "No chat found" } );
        }
        res.status(200).json({ message: "Lấy dữ liệu thành công", messages: mes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/getHistoryChatMessages", async (req, res) => {
    try {
        const { senderId } = req.body;

        if (!senderId) {
            return res.json({ success: false, message: "Phải nhập mã người gửi" });
        }

        const messages = await Message.find({ senderId })
            .populate("chats")
            .populate("senderId")
            .populate("receiverId")
            .sort({ lastMsgTime: 1 });

        if (!messages.length) {
            return res.status(400).json({message: "Không tìm thấy tin nhắn" });
        }

        res.status(200).json({message: "Lấy dữ liệu thành công", messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
