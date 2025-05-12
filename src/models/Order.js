const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    totalPrice:{type: Number},
    date:{type: String},
    receiptStatus:{type: Number},
    //0: new order , 1: go delivery, 2: done, 3: cancel
    idClient:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    idShipper:{type: mongoose.Schema.Types.ObjectId, ref: 'shipper'},
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'product'},
            quantity: { type: Number}
        }
    ],
    fromLocation : {type: [Number], index: '2d'},
    toLocation : {type: [Number], index: '2d'},
});
module.exports = mongoose.model('order', OrderSchema);