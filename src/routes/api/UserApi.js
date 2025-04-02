var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { token } = require('morgan');
require('../../models/User')
const User = mongoose.model("user");
// const { bcryptAdapter } = require('../../config/bcryptAdapter')
const bcryptAdapter = require('../../config/bcryptAdapter');
const JwtAdapter  = require('../../config/JwtAdapter')

router.post('/register', async function (req, res) {
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
});


router.post('/login', async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
});

router.post("/changepassword/:id", async (req, res ) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword, rePassword } = req.body;

    if (!oldPassword || !newPassword || !rePassword) {
      return res.status(400).json({ message: "Nhập đủ thông tin" , updatedUser});
    }

    if (newPassword !== rePassword) {
      return res.status(400).json({ message: "Mật khẩu nhập lại không khớp" , updatedUser});
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại", updatedUser });
    }

    if (oldPassword !== user.password) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng", updatedUser });
    }

    // Mã hóa mật khẩu mới và cập nhật vào người dùng
    user.password = newPassword;
    const updatedUser = await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công" , updatedUser});
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

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { loc: loc },  // Update loc field
            { new: true }   // Return the updated user
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Location updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


router.post("/getUsers", async (req, res) => {
  try {
    const users = await User.find({_id: { $ne: req.body.id }});
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
      return res.status(200).json({ message: 'Lấy dữ liệu thành công', users });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/getUserInfo", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    res.json({ message: 'Lấy dữ liệu thành công' , user});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put("/updateLocationUser/:id", async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(req.params.id,
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


router.post("/getNeedToken", async (req, res) => {
  try {
      const token = req.body.token;
    const data = await User.findByIdAndUpdate(req.body.id,
      {token : token},
      {new: true})
    if (!data) {
      return res.status(404).json({message: "Update token failed", data})
    } else {
      return res.status(200).json({message: "Update token successful", data})
    }
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
})



router.put("/updateUser/:id", async (req, res) => {
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
})
module.exports = router;
