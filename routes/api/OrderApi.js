var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Product = require("../../models/Product");
require("../../models/Order");
const Order = mongoose.model("order");

// router.post("/addOrder", async (req, res) => {
//   try {
//     const {totalPrice, date, receiptStatus, idClient, idStore, idShipper, products,} = req.body;
//     const productDocs = await Product.find({ _id: { $in: products } });
//     if (productDocs.length !== products.length) {
//       return res
//         .status(400)
//         .json({ error: "Một hoặc nhiều sản phẩm không hợp lệ" });
//     }
//     const newOrder = new Order({totalPrice, date, receiptStatus, idClient, idStore, idShipper, products,
//     });
//     const savedOrder = await newOrder.save();
//     res.status(200).json("Thanh toán thành công");
//   } catch (error) {
//     res.status(500).json({ error: "Có lỗi xảy ra khi tạo đơn hàng" });
//   }
// });


router.post("/getOrders", async (req, res) => {
  try {
      // const data = await Order.find()
      const maUser = req.body.id;
      const receiptStatus = req.body.receiptStatus;
      const data = await Order.find({idStore: maUser , receiptStatus : receiptStatus})
      .populate({
        path: "products",
        populate: [
          { path: "idUser", model: "user" },
          { path: "idCategory", model: "category" },
        ],
      })
      .populate("idClient")
      .populate('idShipper')
      .populate("idStore");

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "Không có đơn hàng nào" });
    }
    return res.status(200).json({ message: 'Lấy dữ liệu thành công.', data });
    // res.json(data);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server.' });
  }
});

module.exports = router;
