const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    title: {type : String},
    body: {type : String},
    image: {type : String},
    idUser: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
});
module.exports = mongoose.model('notification', NotificationSchema);