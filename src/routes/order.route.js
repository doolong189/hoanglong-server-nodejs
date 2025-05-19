const express = require( 'express')
const orderRouter = express.Router();
const {createOrder, getOrdersForShipper, getOrdersForUser, getOrderDetail , updateOrderShipper} = require('../controllers/order.controller.js')


orderRouter.post('/createOrder', createOrder);

orderRouter.post("/getOrdersForShipper", getOrdersForShipper);

orderRouter.post("/getOrders", getOrdersForUser);

orderRouter.post("/getOrderDetail", getOrderDetail);

orderRouter.post('/updateOrderShipper', updateOrderShipper);


module.exports = orderRouter