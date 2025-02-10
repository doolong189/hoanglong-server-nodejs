const mongoose = require('mongoose');

const ShippingAddressSchema = mongoose.Schema({
    idClient:{type: mongoose.Schema.Types.ObjectId, ref: 'store'},
    phone:{type: String},
    recipientName:{type: String},
    address:{type: String}
});
module.exports = mongoose.model('shippingaddress', ShippingAddressSchema);