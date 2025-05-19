const vnPayConfig = require('../config/func.js')

exports.createPaymentUrl = function (req, res, next) {
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const {amount, bank_code, language, vn_pay_return_url: vnPayReturnUrl} = req.body;

    let locale = language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }

    const vnpUrl = vnPayConfig.createVpnUrl(
        ipAddr,
        amount,
        bank_code,
        locale,
        vnPayReturnUrl,
    );

    res.status(200).json(vnpUrl);
};

exports.vnPayReturn = function (req, res, next) {
    const vnp_Params = req.query;

    const secureHash = vnp_Params['vnp_SecureHash'];
    const signed = vnPayConfig.buildSigned(vnp_Params);

    if (secureHash == signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        res.status(200).json({ code: vnp_Params['vnp_ResponseCode'] });
    } else {
        res.status(400).json({ code: '97' });
    }
};

exports.vnPayIpn = function (req, res, next) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    let rspCode = vnp_Params['vnp_ResponseCode'];

    const signed = vnPayConfig.buildSigned(vnp_Params);
    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if (secureHash === signed) {
        //kiểm tra checksum
        if (checkOrderId) {
            if (checkAmount) {
                if (paymentStatus == '0') {
                    //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                    if (rspCode == '00') {
                        //thanh cong
                        //paymentStatus = '1'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                        res.status(200).json({ RspCode: '00', Message: 'Success' });
                    } else {
                        //that bai
                        //paymentStatus = '2'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                        res.status(200).json({ RspCode: '00', Message: 'Success' });
                    }
                } else {
                    res.status(200).json({
                        RspCode: '02',
                        Message: 'This order has been updated to the payment status',
                    });
                }
            } else {
                res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
            }
        } else {
            res.status(200).json({ RspCode: '01', Message: 'Order not found' });
        }
    } else {
        res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
};
