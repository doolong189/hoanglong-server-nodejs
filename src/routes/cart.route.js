const express = require('express')
const {createCart, deleteCart, getCart, } = require("../controllers/cart.controller.js")
const cartRouter = express.Router();

cartRouter.post('/createCart', createCart);

cartRouter.post('/getCart', getCart);

cartRouter.post('/deleteCart', deleteCart);

module.exports = cartRouter;