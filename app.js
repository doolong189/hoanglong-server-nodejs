const http = require('http');
const socketIO = require('socket.io')

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router
const authRouter = require('./src/routes/auth.route')
const cartRouter = require('./src/routes/cart.route')
const categoryRouter = require('./src/routes/category.route')
const chatMessageRouter = require('./src/routes/chatmessage.route')
const notificationRouter = require('./src/routes/notification.route')
const orderRouter = require('./src/routes/order.route')
const productRouter = require('./src/routes/product.route')
const reviewRouter = require('./src/routes/review.route')
const userRouter = require('./src/routes/user.route')
const vnPayRouter = require('./src/routes/vnpay.route')

app.use('/user', userRouter)
app.use('/product',productRouter)
app.use('/category',categoryRouter)
app.use('/order',orderRouter)
app.use("/ntf",notificationRouter)
app.use("/cart",cartRouter)
app.use("/chat-message",chatMessageRouter)
app.use("/review",reviewRouter)
app.use("/auth",authRouter)
app.use("/order",vnPayRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// parse application/json
app.use(bodyParser.json())
// connect mongoose db
const db = require('./src/config/db')
db.connectDB()
// connect socket io
// const server = http.createServer(app);
const server = http.createServer();
// const io = socketIO(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   }
// });
const io = socketIO(server);

// const socketController = require('./src/controllers/socketio.controller');
const socketController = require('./src/controllers/socket.io.controller');
socketController.connectSocketIo(io);

server.listen(6868,()=>{
  console.log('Node app is running on port 6868')
});


app.get('/', (req, res) => {
  res.send('Hello world');
});

module.exports = app;
const port = process.env.PORT || 8686;
app.listen(port, () => {
  console.log(`Server api is running on port ${port}`);
});

