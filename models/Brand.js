const mongoose = require('mongoose');

const BrandSchema = mongoose.Schema({
    name:{type: String},
    image:{type: String},
});
module.exports = mongoose.model('brand', BrandSchema);