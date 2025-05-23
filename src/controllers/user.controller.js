const {mongoose , Schema} = require('mongoose')
const User = require('../models/user.model.js')
const bcryptAdapter = require('../config/bcrypt.adapter.js')
const JwtAdapter  = require('../config/jwt.adapter.js')
const Order = require("../models/order.model");

const register = async function (req, res) {
    const existUser = await User.findOne({
        email: req.body.email
    });
    if (existUser) {
        return res.status(400).json({ message: 'Email này đã được đăng ký' });
    }
    if (req.body.email.toString.isEmpty) {
        return res.status(400).json({ message: 'Vui lòng nhập email' });
    }
    if (req.body.password.toString.isEmpty){
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu' });
    }
    try {
        const password = bcryptAdapter.hash(req.body.password);
        const token = await JwtAdapter.generateJWT({ email: req.body.email, password: req.body.password });

        if (!token) {
            return res.status(400).json({ message: 'Lỗi mã hóa mật khẩu' });
        }
        const user = new User({
            name: req.body.name,
            address: req.body.address,
            password: password,
            email: req.body.email,
            phone: req.body.phone,
            image: req.body.image,
            loc: [req.body.longitude, req.body.latitude],
            token: token
        });

        await user.save();
        return res.status(200).json({ message: 'Đăng ký thành công.', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại.'});
        }
        const isMatch = bcryptAdapter.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không đúng.'});
        }
        return res.status(200).json({ message: 'Đăng nhập thành công.', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

const changePassword =  async (req, res ) => {
    try {
        const { id , oldPassword, newPassword, rePassword } = req.body;

        if (!oldPassword || !newPassword || !rePassword) {
            return res.status(400).json({ message: "Nhập đủ thông tin" , updatedUser});
        }

        if (newPassword !== rePassword) {
            return res.status(400).json({ message: "Mật khẩu nhập lại không khớp" , updatedUser});
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại", updatedUser });
        }

        if (oldPassword !== user.password) {
            return res.status(400).json({ message: "Mật khẩu cũ không đúng", updatedUser });
        }
        user.password = newPassword;
        const updatedUser = await user.save();

        return res.status(200).json({ message: "Đổi mật khẩu thành công" , updatedUser});
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const updateLocation =  async (req, res) => {
    try {
        const { id } = req.params;
        // const { loc } = req.body;  // Expecting loc to be [longitude, latitude]
        const loc =  [req.body.longitude, req.body.latitude]

        // if (!Array.isArray(loc) || loc.length !== 2) {
        if (loc.length !== 2) {
            return res.status(400).json({ message: "Lỗi vị trí" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { loc: loc },  // Update loc field
            { new: true }   // Return the updated user
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        return res.status(200).json({ message: "Cập nhật vị trí thành công", data: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getUsers =  async (req, res) => {
    try {
        const users = await User.find({_id: { $ne: req.body.id }});
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        return res.status(200).json({ message: 'Lấy dữ liệu thành công', data : users });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getUserInfo = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
            return res.status(400).json({ message: 'Mã người dùng không đúng' });
        }
        const user = await User.findOne(req.body.id);
        if (!user) {
            return res.status(400).json({ message: 'Không tìm thấy người dùng' });
        }
        return res.status(200).json({ message: 'Lấy dữ liệu thành công' , user});
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const updateLocationUser = async (req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.params.id,
            {loc: [req.body.longitude, req.body.latitude]},
            {new: true})
        if (!data) {
            return res.status(404).json({message: "Cập nhật vị trí thất bại", data})
        } else {
            return res.status(200).json({message: "Cập nhật vị trí thành công", data})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

const updateToken =  async (req, res) => {
    try {
        const token = req.body.token;
        const data = await User.findByIdAndUpdate(req.body.id,
            {token : token},
            {new: true})
        if (!data) {
            return res.status(404).json({message: "Cập nhật token thất bại", data})
        } else {
            return res.status(200).json({message: "Cập nhật token thành công", data})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

const updateUser =  async (req, res) => {
    try {
        const { name, address, password, email, phone, image , loc } = req.body;
        const data = await User.findByIdAndUpdate(req.params.id , {
            name: name,
            address: address,
            password: password,
            email: email,
            phone: phone,
            image : image,
            loc: loc,
            // token: token
        }, {new: true})
        if (!data) {
            return res.status(404).json({message: "update failed", data})
        } else {
            return res.status(200).json({message: "update successful", data})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

const statistical = async (req, res) => {
    try {
        const { idShipper } = req.body;
        const totalOrders = await Order.find({ idShipper: idShipper})
            .populate({ path: "products.product", populate: [
                    { path: "idUser", model: "user" },
                    { path: "idCategory", model: "category" },
                ]})
            .populate("idClient")
            .populate('idShipper');

        const completedOrders = await Order.find({ idShipper: idShipper, receiptStatus: '2' })
            .populate({ path: "products.product", populate: [
                    { path: "idUser", model: "user" },
                    { path: "idCategory", model: "category" },
                ]})
            .populate("idClient")
            .populate('idShipper');

        const canceledOrders = await Order.find({ idShipper: idShipper, receiptStatus: '3' })
            .populate({ path: "products.product", populate: [
                    { path: "idUser", model: "user" },
                    { path: "idCategory", model: "category" },
                ]})
            .populate("idClient")
            .populate('idShipper');

        // const totalReceivedAmount = completedOrders.reduce((total, order) => {
        //     // const orderTotal = order.products.reduce((orderTotal, product) => orderTotal + product.product.price * product.quantity, 0);
        //     // return total + orderTotal;
        //     return total
        // }, 0);
        const totalReceivedAmount = completedOrders.reduce((acc, current) => {
            return acc.feeDelivery
        })

        if (!completedOrders && !canceledOrders) {
            return res.status(400).json({ message: "Không có đơn hàng nào" });
        }

        return res.status(200).json({
            message: 'Lấy dữ liệu thành công',
            totalOrdersCount: completedOrders.length + canceledOrders.length,
            completedOrdersCount: completedOrders.length,
            canceledOrdersCount: canceledOrders.length,
            totalReceivedAmount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    register, login, changePassword, updateLocation, getUsers, getUserInfo, updateLocationUser
    , updateToken, updateUser, statistical
}