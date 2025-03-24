var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../../models/Shipper')
const Shipper = mongoose.model("shipper");
require("../../models/Order");
const Order = mongoose.model("order");
router.post('/register', function(req, res, next) {
    const shipper = new Shipper({
    name: req.body.name,
    address: req.body.address,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    image: req.body.image,
    loc: [req.body.longitude, req.body.latitude] // thêm tọa độ vào mảng loc
  })
  shipper.save()
  .then(data => {
    res.send(data)
  }).catch(err => {
    console.log(err)
  })
});

router.post('/login', async (req, res) => {
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
        res.status(500).json({ message: 'Lỗi server.' });
    }
});

router.post("/changepassword/:id", async (req, res ) => {
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

    // Mã hóa mật khẩu mới và cập nhật vào người dùng
    shipper.password = newPassword;
    const updateShipper = await shipper.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công" , updateShipper});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})


router.post('/update-location/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // const { loc } = req.body;  // Expecting loc to be [longitude, latitude]
        const loc =  [req.body.longitude, req.body.latitude]
        
        // if (!Array.isArray(loc) || loc.length !== 2) {
        if (loc.length !== 2) {
            return res.status(400).json({ message: "Invalid location data" });
        }

        const updatedShipper = await Shipper.findByIdAndUpdate(
            id,
            { loc: loc },  // Update loc field
            { new: true }   // Return the updated Shipper
        );

        if (!updatedShipper) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Location updated successfully", shipper: updatedShipper });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
router.get("/getShippers",async (req,res) => {
  try {
    const shipper = await Shipper.find()
    res.json(shipper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.get("/getShippers/:id", async (req, res) => {
  try {
    const shippers = await Shipper.find({_id: { $ne: req.params.id }});
    if (!shippers || shippers.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.json(shippers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put("/updateLocationShipper/:id", async (req, res) => {
  try {
    const data = await Shipper.findByIdAndUpdate(req.params.id,
      {loc: [req.body.longitude, req.body.latitude]},
      {new: true})
    if (!data) {
      return res.status(404).json({message: "update failed", data})
    } else {
      return res.status(200).json({message: "update successful", data})
    }
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
})

router.put("/updateShipper/:id", async (req, res) => {
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
      return res.status(404).json({message: "update failed", data})
    } else {
      return res.status(200).json({message: "update successful", data})
    }
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
})


router.post("/statistical", async (req, res) => {
    try {
        const { idShipper } = req.body;
        // Lọc các đơn hàng theo idShipper

        const totalOrders = await Order.find({ idShipper: idShipper})
            .populate({ path: "products.product", populate: [
                    { path: "idUser", model: "user" },
                    { path: "idCategory", model: "category" },
                ]})
            .populate("idClient")
            .populate('idShipper');

        const completedOrders = await Order.find({ idShipper: idShipper, receiptStatus: '1' })
            .populate({ path: "products.product", populate: [
                    { path: "idUser", model: "user" },
                    { path: "idCategory", model: "category" },
                ]})
            .populate("idClient")
            .populate('idShipper');

        const canceledOrders = await Order.find({ idShipper: idShipper, receiptStatus: '2' })
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
            return res.status(400).json({ message: "Không có đơn hàng nào." });
        }

        return res.status(200).json({
            message: 'Lấy dữ liệu thành công.',
            totalOrdersCount: totalOrders.length,
            completedOrdersCount: completedOrders.length,
            canceledOrdersCount: canceledOrders.length,
            totalReceivedAmount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
});

router.post("/getShipperInfo", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const shipper = await Shipper.findById(req.body.id);
        if (!shipper) {
            return res.status(400).json({ message: 'Shipper not found' });
        }
        res.json({ message: 'Lấy dữ liệu thành công' , shipper});
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});


module.exports = router;
