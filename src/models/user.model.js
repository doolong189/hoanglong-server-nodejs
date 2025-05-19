const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:{type:String},
    address:{type: String},
    password:{type: String},
    email:{type: String},
    phone:{type: String},
    image:{type: String},
    loc: {type: [Number], index: '2d'},
    // [<longitude>, <latitude>]
    token : {type: String},
});
module.exports = mongoose.model('user', UserSchema);