const mongoose = require('mongoose');
const chatSchema  = new mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "message" }],
    lastMsg: {type : String},
    lastMsgTime: {type : Number}
});

module.exports = mongoose.model('chat', chatSchema);