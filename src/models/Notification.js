const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    title: {type : String},
    body: {type : String},
    image: {type : String},
    idUser: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    type : {type : Number}
    //1: buy - 2: sell - 3: send message == ecommerce
    //1: receiver message - 2: receiver book delivery - 3: done delivery - 4: cancel delivery
});
module.exports = mongoose.model('notification', NotificationSchema);