const express = require('express')
const {createCart, deleteCart, getCart, updateCart} = require("../controllers/cart.controller.js")
const cartRouter = express.Router();

cartRouter.post('/createCart', createCart);

cartRouter.post('/getCart', getCart);

cartRouter.post('/deleteCart', deleteCart);

cartRouter.post('/updateCart', updateCart);

module.exports = cartRouter;