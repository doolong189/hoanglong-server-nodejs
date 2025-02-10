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
var mapuserRouter = require('./routes/api/MapUserApi')
var pushNotificationRouter = require('./routes/api/NotificationApi')
var chatSocketIO = require("./routes/api/ChatSocket")
var cartRouter = require("./routes/api/CartApi")
const mongoose = require('mongoose');
const { error } = require('console');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/product',productRouter);
app.use('/category',categoryRouter);
app.use('/order',orderRouter);
app.use('/shipper',shipperRouter);
app.use("/mapuser",mapuserRouter)
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

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// ///notification
// var admin = require("firebase-admin");
// var serviceAccount = require("./routes/key_service_account.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const notification_options = {
//   priority: "high",
//   timeToLive: 60 * 60 * 24,
// };

// app.post("/firebase/notification", (req, res) => {
//   const registrationToken = req.body.registrationToken;

//   const message = {
//     notification: {
//       title: req.body.title,
//       body: req.body.body,
//       image: req.body.imageUrl,
//     }
//   };

//   const options = notification_options;

//   admin
//     .messaging()
//     .sendToDevice(registrationToken, message, options)
//     .then((response) => {
//       if (response.results[0].messageId == null) {
//         console.log(response.results[0].error);
//         res.status(400).send(response.results[0].error);
//       } else {
//         console.log(message);
//         res.status(200).send('Notification sent successfully with messageId: ' + response.results[0].messageId);
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(400).send(error);
//     });
// });



module.exports = app;
const port = process.env.PORT || 8686;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

