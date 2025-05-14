const {genSaltSync, hashSync, compareSync} = require("bcryptjs");
var vnp_TmnCode = "0ZE53AQG";
var  vnp_HashSecret = "U89C105M6Q347VMKQOUW0JSGDXIVO8BA"
var  vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
var  vnp_Api ='https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
var  vnp_ReturnUrl = "http://localhost:8686/order/vnpay_return"

const vnPayDefault = {
    vnp_TmnCode: () => {
        return vnp_TmnCode;
    },
    vnp_HashSecret: () => {
        return vnp_HashSecret;
    },
    vnp_Url: () => {
        return vnp_Url
    },
    vnp_Api: () => {
        return vnp_Api
    },
    vnp_ReturnUrl : () => {
        return vnp_ReturnUrl
    }
};

module.exports = vnPayDefault;