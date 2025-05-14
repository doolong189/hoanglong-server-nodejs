const { mongoose , Schema } = require('mongoose')
const Shipper = require('../models/Shipper.js')
const Order = require('../models/Order.js')
const User = require('../models/User.js')
const bcryptAdapter = require('../config/bcrypt.adapter.js')
const JwtAdapter  = require('../config/jwt.adapter.js')

exports.register = async function (req, res) {
    const existShipper = await Shipper.findOne({
        email: req.body.email
    });
    if (existShipper) {
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
            return res.status(400).json({ message: 'Lỗi tạo token' });
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
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
        }
        const shipper = await Shipper.findOne({ email });
        if (!shipper) {
            return res.status(201).json({ message: 'Email không tồn tại.'});
        }
        if (password !== shipper.password) {
            return res.status(201).json({ message: 'Mật khẩu không đúng.'});
        }
        return res.status(200).json({ message: 'Đăng nhập thành công.', shipper });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword =  async (req, res ) => {
    try {
        const shipperId = req.params.id;
        const { oldPassword, newPassword, rePassword } = req.body;

        if (!oldPassword || !newPassword || !rePassword) {
            return res.status(400).json({ message: "Nhập đủ thông tin" , updateShipper});
        }

        if (newPassword !== rePassword) {
            return res.status(400).json({ message: "Mật khẩu nhập lại không khớp" , updateShipper});
        }

        const shipper = await Shipper.findById(shipperId);
        if (!shipper) {
            return res.status(404).json({ message: "Người dùng không tồn tại", updateShipper });
        }

        if (oldPassword !== shipper.password) {
            return res.status(400).json({ message: "Mật khẩu cũ không đúng", updateShipper });
        }
        shipper.password = newPassword;
        const updateShipper = await shipper.save();

        res.status(200).json({ message: "Đổi mật khẩu thành công" , updateShipper});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateLocation =  async (req, res) => {
    try {
        const { id } = req.params;
        // const { loc } = req.body;  // Expecting loc to be [longitude, latitude]
        const loc =  [req.body.longitude, req.body.latitude]

        // if (!Array.isArray(loc) || loc.length !== 2) {
        if (loc.length !== 2) {
            return res.status(400).json({ message: "Không tìm thấy vị trí" });
        }

        const updatedShipper = await Shipper.findByIdAndUpdate(
            id,
            { loc: loc },  // Update loc field
            { new: true }   // Return the updated Shipper
        );

        if (!updatedShipper) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        return res.status(200).json({ message: "Cập nhật vị trí thành công", shipper: updatedShipper });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.updateLocationShipper = async (req, res) => {
    try {
        const data = await Shipper.findByIdAndUpdate(req.params.id,
            {loc: [req.body.longitude, req.body.latitude]},
            {new: true})
        if (!data) {
            return res.status(404).json({message: "Cập nhật thất bại", data})
        } else {
            return res.status(200).json({message: "Cập nhật thành công", data})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

exports.updateShipper =  async (req, res) => {
    try {
        const { name, address, password, email, phone, image , loc } = req.body;
        const data = await Shipper.findByIdAndUpdate(req.params.id , {
            name: name,
            address: address,
            password: password,
            email: email,
            phone: phone,
            image : image,
            loc: loc
        }, {new: true})
        if (!data) {
            return res.status(404).json({message: "Cập nhật thất bại", data})
        } else {
            return res.status(200).json({message: "Cập nhật thành công", data})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

exports.getShipperInfo = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
            return res.status(400).json({ message: 'Mã người dùng không tồn tại' });
        }
        const shipper = await Shipper.findById(req.body.id);
        if (!shipper) {
            return res.status(400).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json({ message: 'Lấy dữ liệu thành công' , shipper});
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.statistical = async (req, res) => {
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

        // Tính tổng số tiền từ các đơn hàng hoàn thành
        const totalReceivedAmount = completedOrders.reduce((total, order) => {
            const orderTotal = order.products.reduce((orderTotal, product) => orderTotal + product.product.price * product.quantity, 0);
            return total + orderTotal;
        }, 0);

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
        res.status(500).json({ message: error.message});
    }
}