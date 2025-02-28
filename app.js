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
app.use("/mapUser",mapUserRouter)
app.use("/ntf",pushNotificationRouter)
app.use("/chat",chatSocketIO)
app.use("/cart",cartRouter)

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
// const wss = new WebSocket.Server({ port: 8080 });
//
// const channels = new Map();
//
// wss.on('connection', (ws, req) => {
//   const query = url.parse(req.url, true).query;
//   const channelID = query.channel_id;
//
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
//       client.send(message);
//     }
//   });
// }
//=================//

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

