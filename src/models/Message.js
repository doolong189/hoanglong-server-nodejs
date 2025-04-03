const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    messageId: { type: String, required: true, unique: true },
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "chat" }],
    lastMsg: {type : String},
    lastMsgTime: {type : Number}
});

module.exports = mongoose.model("message", messageSchema);
