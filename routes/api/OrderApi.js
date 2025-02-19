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
      // order.products.push({ product: product.product, quantity: product.quantity });
      order.products.push({ product: product.id, quantity: product.quantity });

      order.totalPrice += product.price * product.quantity;
    }

    // Tạo đơn hàng cho từng cửa hàng
    const createdOrders = [];
    for (const [storeId, orderData] of ordersMap.entries()) {
      const newOrder = new Order({
        totalPrice: orderData.totalPrice,
        date: new Date().getTime(),
        receiptStatus: 0,
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

router.post("/getOrdersForShipper", async (req, res) => {
  try {
    const receiptStatus = req.body.receiptStatus;
    const data = await Order.find({receiptStatus : receiptStatus})
        .populate({path: "products.product", populate: [
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

router.post("/getOrders", async (req, res) => {
  try {
      const maUser = req.body.id;
      const receiptStatus = req.body.receiptStatus;
      const data = await Order.find({idClient: maUser , receiptStatus : receiptStatus})
      .populate({path: "products.product", populate: [
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

router.post("/getOrderDetail", async (req, res) => {
  try {
    const data = await Order.findById(req.body.id)
        .populate({path: "products.product", populate: [
            { path: "idUser", model: "user" },
            { path: "idCategory", model: "category" },
          ]})
        .populate("idClient")
        .populate("idShipper");
    console.log(data.idClient);

    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    return res.status(200).json({ message: "Lấy dữ liệu thành công" , data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});

router.post('/updateShipper', async (req, res) => {
  try {
    const { orderId, idShipper } = req.body;
    // const { orderId } = req.params;

    if (!idShipper) {
      return res.status(400).json({ message: 'idShipper không được để trống' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { idShipper: idShipper },
        { new: true }
    ).populate('idShipper');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.status(200).json({ message: 'Cập nhật idShipper thành công', order: updatedOrder });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
});


module.exports = router;
