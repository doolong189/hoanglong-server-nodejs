var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/api/UserApi');
var productRouter = require('./routes/api/ProductApi')
var categoryRouter = require('./routes/api/CategoryApi')
var orderRouter = require('./routes/api/OrderApi')
var shipperRouter = require('./routes/api/ShipperApi')
var mapUserRouter = require('./routes/api/MapUserApi')
var pushNotificationRouter = require('./routes/api/NotificationApi')
var chatSocketIO = require("./routes/api/ChatSocket")
var cartRouter = require("./routes/api/CartApi")
var chatMessageRouter = require("./routes/api/ChatMessageApi")
const mongoose = require('mongoose');
const { error } = require('console');
var app = express();
// var http=require('http').Server(app)
// var io = require('socket.io')(http);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/product',productRouter);
app.use('/category',categoryRouter);
app.use('/order',orderRouter);
app.use('/shipper',shipperRouter);
app.use("/map-user",mapUserRouter)
app.use("/ntf",pushNotificationRouter)
app.use("/chat",chatSocketIO)
app.use("/cart",cartRouter)
app.use("/chat-message",chatMessageRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// parse application/json
app.use(bodyParser.json())


//connection database mongoodb
const mongoURL= 'mongodb+srv://hoanglong180903:Hoanglong180903@atlascluster.6r7fs.mongodb.net/ShopEase'
mongoose.connect(mongoURL)
.then(() => {
  console.log("connection successfully")
})
.catch((error) => {
  console.log("Error connecting to database")
});
//
app.get('/', (req, res) => {
  res.send('Chat Server is running on port 3000');
});

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
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer();
const io = socketIo(server);

// const channels = new Map();
// io.on('connection', (socket) => {
//   const query = socket.request._query;
//   const channelID = query.channel_id;
//   console.log(query)
//   console.log(channelID)
//   if (!channelID) {
//     socket.disconnect();
//     return;
//   }
//   if (!channels.has(channelID)) {
//     channels.set(channelID, new Set());
//   }
//   channels.get(channelID).add(socket);
//   socket.on('message', (message, userId) => {
//     console.log(`Received message in channel ${channelID}:`, message);
//     broadcastMessage(channelID, message , userId);
//   });
//   socket.on('close', () => {
//     channels.get(channelID).delete(socket);
//     if (channels.get(channelID).size === 0) {
//       channels.delete(channelID);
//     }
//   });
// });
// function broadcastMessage(channelID, messages , userId) {
//   if (!channels.has(channelID)) return;
//   channels.get(channelID).forEach(client => {
//       let  message = {" id ":userId, " message ":messages}
//       client.emit('message', message)
//   });
// }

const channels = new Map();

io.on('connection', (socket) => {
  const query = socket.request._query;
  const channelID = getChannelID(query.userId, query.partnerId);
  console.log(query);
  console.log(channelID);

  if (!channelID) {
    socket.disconnect();
    return;
  }

  if (!channels.has(channelID)) {
    channels.set(channelID, new Set());
  }

  channels.get(channelID).add(socket);

  socket.on('message', (message, userId) => {
    console.log(`Received message in channel ${channelID}:`, message);
    broadcastMessage(channelID, message, userId);
  });

  socket.on('close', () => {
    channels.get(channelID).delete(socket);
    if (channels.get(channelID).size === 0) {
      channels.delete(channelID);
    }
  });
});

function getChannelID(userId, partnerId) {
  const sortedIds = [userId, partnerId].sort();
  return sortedIds.join('-');
}

function broadcastMessage(channelID, message, userId) {
  if (!channels.has(channelID)) return;
  channels.get(channelID).forEach(client => {
    let messageToSend = { "id": userId, "message": message };
    client.emit('message', messageToSend);
  });
}

server.listen(6868, () => {
  console.log('Server is listening on port 6868');
});

//========   Chat room - Socket.io ========//

// const http = require('http');
// const socketIo = require('socket.io');
// const server = http.createServer();
// const io = socketIo(server);
// app.get('/', (req, res) => {
//   res.send('Chat Server is running on port 3000')
// });
//
// io.on('connection', (socket) => {
//   console.log('user connected')
//   socket.on('join', function(userNickname) {
//     console.log(userNickname + ` : has joined the chat `  );
//     socket.broadcast.emit('userjoinedthechat',userNickname + ` : has joined the chat `);
//   })
//   socket.on('messagedetection', (senderNickname,messageContent) => {
//     console.log(senderNickname+" : " +messageContent)
//     let  message = {"message":messageContent, "senderNickname":senderNickname}
//     io.emit('message', message )
//   })
//   socket.on('disconnect', function(userNickname) {
//     console.log(userNickname +' has left ')
//     socket.broadcast.emit( "userdisconnect" ,userNickname + ` : has left the chat `)
//   })
// })
//
// server.listen(6868,()=>{
//   console.log('Node app is running on port 6868')
// });


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
const port = process.env.PORT || 8686;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

