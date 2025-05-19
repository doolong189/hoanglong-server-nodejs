const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    title: {type : String},
    body: {type : String},
    image: {type : String},
    idUser: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    type : {type : Number}
    //1: buy - 2: sell - 3: receiver message ==> ecommerce
    //4: done delivery - 5 cancel delivery - 6: receiver message ==> driver
});
module.exports = mongoose.model('notification', NotificationSchema);