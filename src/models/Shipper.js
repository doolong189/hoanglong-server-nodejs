const mongoose = require('mongoose');

const ShipperSchema = mongoose.Schema({
    name:{type:String},
    address:{type: String},
    password:{type: String},
    email:{type: String},
    phone:{type: String},
    image:{type: String},
    loc: {
        type: [Number],
        index: '2d'
    }
});
module.exports = mongoose.model('shipper', ShipperSchema);