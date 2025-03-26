const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    title:{type:String},
    date:{type: String},
    rating:{type: Number},
    idUser:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    idProduct : {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
});
module.exports = mongoose.model('review', ReviewSchema);