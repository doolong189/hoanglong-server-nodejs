const express = require('express');
const notificationRouter = express.Router();
const {pushNotification, createNotification, getNotification, getDetailNotification}  = require('../controllers/notification.controller.js')

notificationRouter.post("/pushNotification", pushNotification)

notificationRouter.post("/createNotification", createNotification)

notificationRouter.post("/getNotification",getNotification)

notificationRouter.post("/getDetailNotification" ,getDetailNotification)

module.exports = notificationRouter