const express = require('express')
const chatMessageRouter = express.Router();
const {createChatMessage, getChatMessages, getHistoryChatMessages} = require('../controllers/chatmessage.controller.js')

chatMessageRouter.post("/createChatMessage",createChatMessage)

chatMessageRouter.post("/getChatMessages",getChatMessages)

chatMessageRouter.post("/getHistoryChatMessages",getHistoryChatMessages)

module.exports = chatMessageRouter