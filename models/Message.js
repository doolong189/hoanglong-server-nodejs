const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    messageImage : {type : String},
    messageText: {type : String},
    senderId: {type : String},
    timestamp: {type : Number}
});

module.exports = mongoose.model("message", messageSchema);
