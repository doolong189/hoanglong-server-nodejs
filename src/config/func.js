const moment = require("moment")
const qs = require ('qs');
const crypto = require("crypto")
const vnPayDefault = require("../config/vnpay.js")
const VnPayConfig = {
    sortObject: (obj) => {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
        }
        return sorted;
    },
    createVpnUrl: (ipAddr,
                   amount,
                   bankCode,
                   locale,
                   vnPayReturnUrl,) => {
        process.env.TZ = 'Asia/Ho_Chi_Minh';

        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');

        const tmnCode = vnPayDefault.vnp_TmnCode();
        const secretKey = vnPayDefault.vnp_HashSecret();
        const orderId = moment(date).format('DDHHmmss');

        let vnpUrl = vnPayDefault.vnp_Url();
        const currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = vnPayReturnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params = VnPayConfig.sortObject(vnp_Params);
        let signData = qs.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac('sha512', secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

        return vnpUrl;
    },


    buildSigned: (vnp_Params) => {
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        vnp_Params = VnPayConfig.sortObject(vnp_Params);
        const secretKey = vnPayDefault.vnp_HashSecret();
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');
        return signed;
    },
};

module.exports = VnPayConfig;


