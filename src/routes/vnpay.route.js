const express = require('express');
const vnPayRouter = express.Router();
const {createPaymentUrl , vnPayReturn , vnPayIpn} = require("../controllers/vnpay.controller");
vnPayRouter.post('/create_payment_url', createPaymentUrl);

vnPayRouter.get('/vnpay_return',vnPayReturn);

vnPayRouter.get('/vnpay_ipn', vnPayIpn);

module.exports = vnPayRouter;