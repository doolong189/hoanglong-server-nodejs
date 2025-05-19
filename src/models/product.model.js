const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  name: {type: String},
  price: {type: Number},
  quantity: {type: Number},
  discount : { type : Number },
  description: {type: String},
  image: {type: String},
  imageDetail: [{type : String}],
  idUser: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  idCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'category'},
});
module.exports = mongoose.model('product', ProductSchema);