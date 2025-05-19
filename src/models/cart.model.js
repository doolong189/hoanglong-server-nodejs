const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    idProduct: {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
    idUser:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    quantity : {type : Number},
});
module.exports = mongoose.model('cart', CartSchema);