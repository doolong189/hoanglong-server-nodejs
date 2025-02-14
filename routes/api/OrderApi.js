var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
require("../../models/Order");
const Order = mongoose.model("order");


router.post('/createOrder', async (req, res) => {
  try {
    const { products, idClient, idShipper } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Danh sách sản phẩm không được để trống' });
    }

    const ordersMap = new Map();

    for (const product of products) {
      const storeId = product.idStore;
      if (!ordersMap.has(storeId)) {
        ordersMap.set(storeId, {
          totalPrice: 0,
          products: [],
          idStore: storeId
        });
      }

      let order = ordersMap.get(storeId);
      order.products.push(product.id);
      order.totalPrice += product.price * product.quantity;
    }

    // Tạo đơn hàng cho từng cửa hàng
    const createdOrders = [];
    for (const [storeId, orderData] of ordersMap.entries()) {
      const newOrder = new Order({
        totalPrice: orderData.totalPrice,
        date: new Date().getTime(),
        receiptStatus: 0, // Trạng thái mặc định đang giao hàng
        idClient: idClient,
        idShipper: null,
        products: orderData.products
      });

      const savedOrder = await newOrder.save();
      createdOrders.push(savedOrder);
    }

    res.status(200).json({ message: 'Thanh toán thành công', orders: createdOrders });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
});

router.post("/getOrders", async (req, res) => {
  try {
      const maUser = req.body.id;
      const receiptStatus = req.body.receiptStatus;
      const data = await Order.find({idClient: maUser , receiptStatus : receiptStatus})
      .populate({path: "products", populate: [
          { path: "idUser", model: "user" },
          { path: "idCategory", model: "category" },
        ]})
      .populate("idClient")
      .populate('idShipper')

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "Không có đơn hàng nào" });
    }
    return res.status(200).json({ message: 'Lấy dữ liệu thành công.', data });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server.' });
  }
});

router.post("/getDetailOrders", async (req, res) => {
  try {
    const id = req.body.id;
    const data = await Order.findOne({_id: id})
        .populate({
          path: "products",
          populate: [
            { path: "idUser", model: "user" },
            { path: "idCategory", model: "category" },
          ],
        })
        .populate("idClient")
        .populate('idShipper')
    if (!data || data.length === 0) {
      return res.status(400).json({ message: "Không có đơn hàng nào" });
    }
    return res.status(200).json({ message: 'Lấy dữ liệu thành công.', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server.' });
  }
});

module.exports = router;
