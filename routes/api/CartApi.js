var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../../models/Cart')
const Cart = mongoose.model("cart");

router.post('/addCart', async (req, res) => {
    try {
        const { idProduct, idUser, quantity } = req.body;
        const existingCartItem = await Cart.findOne({ idProduct: idProduct, idUser: idUser });
        
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            res.status(200).json({ message: 'Đã thêm sản phẩm vào giỏ hàng' });
        } else {
            const newCartItem = new Cart({ idProduct, idUser, quantity });
            await newCartItem.save();
            res.status(200).json({ message: 'Đã thêm sản phẩm vào giỏ hàng' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/getCart', async (req, res) => {
    try {
        const idUser = req.body.idUser;
        const cartItems = await Cart.find({ idUser: idUser }).populate("idProduct");
        if (!cartItems.length) {
            return res.status(400).json({ code: 400, message: ['Không có sản phẩm nào trong giỏ hàng'], response: null });
        }
        
        const formattedResponse = {
            code: 200,
            message: ['Lấy dữ liệu thành công'],
            response: {
                products: cartItems.map(item => ({
                    id: item.id,
                    name: item.idProduct.name,
                    price: item.idProduct.price,
                    quantity: item.quantity,
                    image : item.idProduct.image,
                    idStore : item.idProduct.idUser
                })),
                totalNumber: cartItems.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: cartItems.reduce((sum, item) => sum + item.idProduct.price * item.quantity, 0),
                discount: 0
            }
        };
        res.status(200).json(formattedResponse);
    } catch (error) {
        res.status(500).json({ code: 500, message: [error.message], response: null });
    }
});


module.exports = router;
