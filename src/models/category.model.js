const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name:{type: String},
    image:{type: String},
});
module.exports = mongoose.model('category', CategorySchema);