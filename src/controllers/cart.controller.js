const Cart = require("../models/Cart.js");
const cartService = require('../service/cart.service');

exports.createCart =  async (req, res) => {
    try {
        const { idProduct, idUser, quantity } = req.body;
        const existingCartItem = await Cart.findOne({ idProduct: idProduct, idUser: idUser });

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            res.status(200).json({ message: 'Đã sửa sản phẩm trong giỏ hàng' });
        } else {
            // const newCartItem = new Cart({ idProduct, idUser, quantity });
            // await newCartItem.save();
            await cartService.createCart(idProduct, idUser, quantity)
            res.status(200).json({ message: 'Đã thêm sản phẩm vào giỏ hàng' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCart =  async (req, res) => {
    try {
        const idUser = req.body.idUser;
        const cartItems = await cartService.getCarts({ idUser }).populate("idProduct");

        if (!cartItems.length) {
            return res.status(400).json({ code: 400, message: ['Không có sản phẩm nào trong giỏ hàng'], response: null });
        }

        const validCartItems = cartItems.filter(item => item.idProduct);

        const formattedResponse = {
            code: 200,
            message: ['Lấy dữ liệu thành công'],
            response: {
                products: validCartItems.map(item => ({
                    id: item.idProduct._id,
                    name: item.idProduct.name,
                    price: item.idProduct.price,
                    quantity: item.quantity,
                    discount: item.idProduct.discount,
                    image: item.idProduct.image,
                    idStore: item.idProduct.idUser
                })),
                totalNumber: validCartItems.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: validCartItems.reduce((sum, item) => sum + item.idProduct.price * item.quantity, 0),
                discount: 0
            }
        };

        res.status(200).json(formattedResponse);
    } catch (error) {
        res.status(500).json({ code: 500, message: [error.message], response: null });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const { idUser, idProduct } = req.body;
        await Cart.deleteOne({ idUser, idProduct });
        res.status(200).json({ message: "Product đã xóa ra khỏi giỏ hàng" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const { idUser, idProduct, quantity } = req.body;
        const cartItem = await Cart.findOne({ idUser: idUser, idProduct: idProduct });
        if (!cartItem) {
            return res.status(404).json({ code: 404, message: ['Sản phẩm không có trong giỏ hàng'], response: null });
        }
        cartItem.quantity += quantity;
        await cartItem.save();
        const cartItems = await Cart.find({ idUser: idUser }).populate('idProduct');
        const validCartItems = cartItems.filter(item => item.idProduct);
        const formattedResponse = {
            code: 200,
            message: ['Cập nhật giỏ hàng thành công'],
            response: {
                products: validCartItems.map(item => ({
                    id: item.idProduct._id,
                    name: item.idProduct.name,
                    price: item.idProduct.price,
                    quantity: item.quantity,
                    image: item.idProduct.image,
                    idStore: item.idProduct.idUser
                })),
                totalNumber: validCartItems.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: validCartItems.reduce((sum, item) => sum + item.idProduct.price * item.quantity, 0),
                discount: 0
            }
        };
        res.status(200).json(formattedResponse);

    } catch (error) {
        res.status(500).json({ code: 500, message: [error.message], response: null });
    }
};

