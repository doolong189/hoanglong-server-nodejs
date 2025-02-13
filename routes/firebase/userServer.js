var express = require('express');

var app = express();
var http=require('http').Server(app)
var port = 3000;

var io = require('socket.io')(http);

var admin = require("firebase-admin");

var FCM = require('fcm-push');
var serverKey ='AAAAzCFOfys:APA91bE0zt9-aHqk3_s7EU7RIBjFcCDmteRzc0RGaa7jyWHnkZVpEBSlAKKO34Zu3ntJi0s6AruTHh3_du8fahM1ZWVSZMVG7747_n_Lv7a_7FtP-8VCNPYTFaC78aTNO06b_49eefuw';
var fcm = new FCM(serverKey);

var userFriendsrequests=(io)=>{
    io.on('connection', function(socket) {
        var i=socket.id
        console.log(i+"has connected to friend services")
        socket.on('disconnect', function() {
            console.log("has disconnected")
        });
        sendMessage(socket,io);
    });

    function sendMessage(socket,io){
        socket.on('details',(data)=>{
            var db = admin.database();
            var friendMessageRef = db.ref('userMessages').child(encodeEmail(data.friendEmail))
                .child(encodeEmail(data.senderEmail)).push();

            var newfriendMessagesRef = db.ref('newUserMessages').child(encodeEmail(data.friendEmail))
                .child(friendMessageRef.key);

            var message={
                messageId: friendMessageRef.key,
                messageText: data.messageText,
                messageSenderEmail: data.senderEmail,
                messageSenderPicture: data.senderPicture,
                messageType:data.type,
                messageTime:data.finaltime
            };
            friendMessageRef.set(message);
            newfriendMessagesRef.set(message);
        });
    }
};
module.exports={
    userFriendsrequests
};