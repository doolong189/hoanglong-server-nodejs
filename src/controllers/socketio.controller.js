const http = require('http')
const socketIo = require('socket.io')
const server = http.createServer();
const io = socketIo(server);

const channels = new Map();

// io.on('connection', (socket) => {
//     const query = socket.request._query;
//     const channelID = getChannelID(query.userId, query.partnerId);
//     console.log(query);
//     console.log(channelID);
//
//     if (!channelID) {
//         socket.disconnect();
//         return;
//     }
//
//     if (!channels.has(channelID)) {
//         channels.set(channelID, new Set());
//     }
//
//     channels.get(channelID).add(socket);
//
//     socket.on('message', (message, userId) => {
//         console.log(`Received message in channel ${channelID}:`, message);
//         broadcastMessage(channelID, message, userId);
//     });
//
//     socket.on('close', () => {
//         channels.get(channelID).delete(socket);
//         if (channels.get(channelID).size === 0) {
//             channels.delete(channelID);
//         }
//     });
// });
//
// function getChannelID(userId, partnerId) {
//     const sortedIds = [userId, partnerId].sort();
//     return sortedIds.join('-');
// }
//
// function broadcastMessage(channelID, message, userId) {
//     if (!channels.has(channelID)) return;
//     channels.get(channelID).forEach(client => {
//         let messageToSend = { "id": userId, "message": message };
//         client.emit('message', messageToSend);
//     });
// }
//
// //========   Chat room - Socket.io ========//
//
// // const http = require('http');
// // const socketIo = require('socket.io');
// // const server = http.createServer();
// // const io = socketIo(server);
// // app.get('/', (req, res) => {
// //   res.send('Chat Server is running on port 3000')
// // });
// //
// // io.on('connection', (socket) => {
// //   console.log('user connected')
// //   socket.on('join', function(userNickname) {
// //     console.log(userNickname + ` : has joined the chat `  );
// //     socket.broadcast.emit('userjoinedthechat',userNickname + ` : has joined the chat `);
// //   })
// //   socket.on('messagedetection', (senderNickname,messageContent) => {
// //     console.log(senderNickname+" : " +messageContent)
// //     let  message = {"message":messageContent, "senderNickname":senderNickname}
// //     io.emit('message', message )
// //   })
// //   socket.on('disconnect', function(userNickname) {
// //     console.log(userNickname +' has left ')
// //     socket.broadcast.emit( "userdisconnect" ,userNickname + ` : has left the chat `)
// //   })
// // })
// //
// // server.listen(6868,()=>{
// //   console.log('Node app is running on port 6868')
// // });
//
//
// // const WebSocket = require('ws');
// // const url = require('url');
// //
// // const wss = new WebSocket.Server({ port: 4953 });
// //
// // const channels = new Map();
// //
// // wss.on('connection', (ws, req) => {
// //   const query = url.parse(req.url, true).query;
// //   const channelID = query.channel_id;
// //   console.log(query)
// //   console.log(channelID)
// //   if (!channelID) {
// //     ws.close();
// //     return;
// //   }
// //
// //   if (!channels.has(channelID)) {
// //     channels.set(channelID, new Set());
// //   }
// //   channels.get(channelID).add(ws);
// //
// //   ws.on('message', (message) => {
// //     console.log(`Received message in channel ${channelID}:`, message);
// //     broadcastMessage(channelID, message);
// //   });
// //
// //   ws.on('close', () => {
// //     channels.get(channelID).delete(ws);
// //     if (channels.get(channelID).size === 0) {
// //       channels.delete(channelID);
// //     }
// //   });
// // });
// //
// // function broadcastMessage(channelID, message) {
// //   if (!channels.has(channelID)) return;
// //
// //   channels.get(channelID).forEach(client => {
// //     if (client.readyState === WebSocket.OPEN) {
// //       const messageStr = typeof message === 'string' ? message : message.toString();
// //       client.send(messageStr);
// //     }
// //   });
// // }


//=================//
// const WebSocket = require('ws');
// const url = require('url');
//
// const wss = new WebSocket.Server({ port: 4953 });
//
// const channels = new Map();
//
// wss.on('connection', (ws, req) => {
//   const query = url.parse(req.url, true).query;
//   const channelID = query.channel_id;
//   console.log(query)
//   console.log(channelID)
//   if (!channelID) {
//     ws.close();
//     return;
//   }
//
//   if (!channels.has(channelID)) {
//     channels.set(channelID, new Set());
//   }
//   channels.get(channelID).add(ws);
//
//   ws.on('message', (message) => {
//     console.log(`Received message in channel ${channelID}:`, message);
//     broadcastMessage(channelID, message);
//   });
//
//   ws.on('close', () => {
//     channels.get(channelID).delete(ws);
//     if (channels.get(channelID).size === 0) {
//       channels.delete(channelID);
//     }
//   });
// });
//
// function broadcastMessage(channelID, message) {
//   if (!channels.has(channelID)) return;
//
//   channels.get(channelID).forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       const messageStr = typeof message === 'string' ? message : message.toString();
//       client.send(messageStr);
//     }
//   });
// }

//========    Chat 1:1 - Socket.io   =========//
// const http = require('http');
// const socketIo = require('socket.io');
// const server = http.createServer();
// const io = socketIo(server);
//
// const channels = new Map();
//
// io.on('connection', (socket) => {
//   const query = socket.request._query;
//   const channelID = getChannelID(query.userId, query.partnerId);
//   console.log(query);
//   console.log(channelID);
//
//   if (!channelID) {
//     socket.disconnect();
//     return;
//   }
//
//   if (!channels.has(channelID)) {
//     channels.set(channelID, new Set());
//   }
//
//   channels.get(channelID).add(socket);
//
//   socket.on('message', (message, userId) => {
//     console.log(`Received message in channel ${channelID}:`, message);
//     broadcastMessage(channelID, message, userId);
//   });
//
//   socket.on('close', () => {
//     channels.get(channelID).delete(socket);
//     if (channels.get(channelID).size === 0) {
//       channels.delete(channelID);
//     }
//   });
// });
//
// function getChannelID(userId, partnerId) {
//   const sortedIds = [userId, partnerId].sort();
//   return sortedIds.join('-');
// }
//
// function broadcastMessage(channelID, message, userId) {
//   if (!channels.has(channelID)) return;
//   channels.get(channelID).forEach(client => {
//     let messageToSend = { "id": userId, "message": message };
//     client.emit('message', messageToSend);
//   });
// }
//
// server.listen(6868, () => {
//   console.log('Server socket is listening on port 6868');
// });

//========   Chat room - Socket.io ========//

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer();
const io = socketIo(server);
app.get('/', (req, res) => {
    res.send('Chat Server is running on port 3000')
});

io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('join', function(userNickname) {
        console.log(userNickname + ` : has joined  `  );
        socket.broadcast.emit('userjoinedthechat',userNickname + ` : has joined the chat `);
    })
    socket.on('messagedetection', (senderNickname,messageContent) => {
        console.log(senderNickname+" : " +messageContent)
        let  message = {"message":messageContent, "senderNickname":senderNickname}
        io.emit('message', message )
    })
    socket.on('disconnect', function(userNickname) {
        console.log(userNickname +' has left ')
        socket.broadcast.emit( "userdisconnect" ,userNickname + ` : has left the chat `)
    })
})

server.listen(6868, () => {
    console.log('Server socket is listening on port 6868');
});