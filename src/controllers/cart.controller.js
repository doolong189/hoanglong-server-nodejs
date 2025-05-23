const Cart = require("../models/cart.model.js");
const cartService = require('../service/cart.service');

const createCart =  async (req, res) => {
    try {
        const { idProduct, idUser, quantity } = req.body;
        const existingCartItem = await Cart.findOne({ idProduct: idProduct, idUser: idUser });

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            return res.status(200).json({ message: 'Đã cập nhật sản phẩm trong giỏ hàng' });
        } else {
            await cartService.createCart(idProduct, idUser, quantity)
            return res.status(200).json({ message: 'Đã thêm sản phẩm vào giỏ hàng' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getCart =  async (req, res) => {
    try {
        const idUser = req.body.idUser;
        const cartItems = await cartService.getCarts({ idUser }).populate("idProduct");

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Không có sản phẩm nào trong giỏ hàng"  });
        }

        const validCartItems = cartItems.filter(item => item.idProduct);

        const formattedResponse = {
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
        return res.status(500).json({message: error.message});
    }
};

const deleteCart = async (req, res) => {
    try {
        const { idUser, idProduct } = req.body;
        await Cart.deleteOne({ idUser, idProduct });
        if (!idProduct) {
            return res.status(400).json({ message: "Không tìm thấy sản phẩm" });
        }
        return res.status(200).json({ message: "Sản phẩm đã xóa ra khỏi giỏ hàng" });
    } catch (error) {
        return  res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCart, getCart, deleteCart
}