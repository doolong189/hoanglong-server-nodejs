const mongoose = require('mongoose');

const MapUserSchema = mongoose.Schema({
    // loc: {
    // type: [Number],  // [<longitude>, <latitude>]
    // index: '2d'      // create the geospatial index
    // },
    lon: Number,
    lat: Number,
    icon:{type: String}
    //new
});
module.exports = mongoose.model('mapuser', MapUserSchema);