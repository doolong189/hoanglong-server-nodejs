var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../../models/MapUser')
const MapUser = mongoose.model("mapuser");

router.post('/addMapUser', function (req, res, next) {
  const mapuser = new MapUser({
    lon: req.body.lon,
    lat: req.body.lat,
    icon: req.body.image,
  })
  mapuser.save()
    .then(data => {
      res.send(data)
    }).catch(err => {
      console.log
    })
});

router.get("/getMapUser", async (req, res) => {
  try {
    const mapuser = await MapUser.find()
    res.json(mapuser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;
