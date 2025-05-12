// Import any required models here
const AuthService = require('../models/User');
const Cart = require("../models/Cart");
// Define your service methods
exports.getCarts = async (idUser) => {
    return Cart.find(idUser);
};

exports.createCart = async (idProduct, idUser, quantity) => {
    const createCart = new Cart({ idProduct, idUser , quantity });
    return await createCart.save();
};

exports.findId = async () => {
    return Cart.findOne({idProduct: idProduct, idUser: idUser});
};
