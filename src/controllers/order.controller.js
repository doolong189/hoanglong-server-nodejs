const Order = require("../models/order.model.js")
const geoDistances = require("geolocation-distance")

const createOrder = async (req, res) => {
    try {
        const { products, idClient, fromLocation , toLocation  , timer , feeDelivery } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'Danh sách sản phẩm trống' });
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
            order.products.push({ product: product.id, quantity: product.quantity });
            order.totalPrice += product.price * product.quantity;
        }
        const pointA = {
            y: fromLocation[1],
            x: fromLocation[0]
        };
        const pointB = {
            y: toLocation[1],
            x: toLocation[0]
        };
        let geoDistance = geoDistances.getDistance(pointA, pointB)
        let distance = ""
        if (geoDistance < 1){
            distance = (geoDistance * 1652) + " m"
        }else{
            distance = geoDistance + " km"
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
                products: orderData.products,
                fromLocation : fromLocation,
                toLocation :toLocation,
                distance : distance,
                timer : timer,
                feeDelivery: feeDelivery
            });

            const savedOrder = await newOrder.save();
            createdOrders.push(savedOrder);
        }
        return res.status(200).json({ message: 'Thanh toán thành công', orders: createdOrders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const getOrdersForShipper = async (req, res) => {
    try {
        const {receiptStatus , id} = req.body
        if (receiptStatus === 0){
            const data = await Order.find({receiptStatus : receiptStatus})
                .populate({path: "products.product", populate: [
                        { path: "idUser", model: "user" },
                        { path: "idCategory", model: "category" },
                    ]})
                .populate("idClient")
                .populate('idShipper')
            return res.status(200).json({ message: 'Lấy dữ liệu thành công.', data });

        }else{
            const data = await Order.find({idShipper: id ,receiptStatus : receiptStatus})
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
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const getOrdersForUser = async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
};

const getOrderDetail =  async (req, res) => {
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
        return res.status(500).json({ message: error.message });
    }
};

const updateOrderShipper = async (req, res) => {
    try {
        const { orderId, idShipper } = req.body;

        if (!idShipper) {
            return res.status(400).json({ message: 'Mã người dùng không tồn tại' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { idShipper: idShipper },
            { new: true }
        ).populate('idShipper');

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        return res.status(200).json({ message: 'Cập nhật mã người giao thành công', order: updatedOrder });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder, getOrdersForShipper, getOrdersForUser , getOrderDetail, updateOrderShipper
}