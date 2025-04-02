const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    // totalAmount:{type: String},
    // totalDiscount:{type: String},
    // idUser:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    // products: [{type: mongoose.Schema.Types.ObjectId, ref: 'product'}]
    idProduct: {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
    idUser:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    quantity : {type : Number},
});
module.exports = mongoose.model('cart', CartSchema);