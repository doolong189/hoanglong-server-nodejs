const express = require( 'express');
const shipperRouter = express.Router();
const {register, login, changePassword, updateLocation, getNeedToken , statistical , getShipperInfo, updateLocationShipper, updateShipper
} = require( "../controllers/shipper.controller.js");

shipperRouter.post('/register', register);

shipperRouter.post('/login', login);

shipperRouter.post("/change-password/:id", changePassword)

shipperRouter.post('/update-location/:id', updateLocation);

shipperRouter.post("/getShipperInfo", getShipperInfo);

shipperRouter.put("/updateLocationShipper/:id", updateLocationShipper)

shipperRouter.put("/updateShipper/:id", updateShipper)

shipperRouter.post('/statistical', statistical);

module.exports = shipperRouter

