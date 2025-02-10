const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true }, // ID hoặc tên người gửi
    receiver: { type: String, required: true }, // ID hoặc tên người nhận
    message: { type: String, required: true }, // Nội dung tin nhắn
    timestamp: { type: Date, default: Date.now } // Thời gian gửi
});

module.exports = mongoose.model('Message', messageSchema);
