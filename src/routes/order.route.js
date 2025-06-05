const express = require( 'express')
const orderRouter = express.Router();
const {createOrder, getOrdersForShipper, getOrdersForUser, getOrderDetail , confirmOrderShipper} = require('../controllers/order.controller.js')


orderRouter.post('/createOrder', createOrder);

orderRouter.post("/getOrdersForShipper", getOrdersForShipper);

orderRouter.post("/getOrders", getOrdersForUser);

orderRouter.post("/getOrderDetail", getOrderDetail);

orderRouter.post('/confirmOrderShipper', confirmOrderShipper);


module.exports = orderRouter