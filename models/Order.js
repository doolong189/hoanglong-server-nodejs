const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    totalPrice:{type: Number},
    date:{type: String},
    receiptStatus:{type: Number},
    idClient:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    idShipper:{type: mongoose.Schema.Types.ObjectId, ref: 'shipper'},
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'product'},
            quantity: { type: Number}
        }
    ]
});
module.exports = mongoose.model('order', OrderSchema);