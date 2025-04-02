var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
require("../../models/Review");
const Notification = require("../../models/Notification");
const Review = mongoose.model("review");


router.post('/createReview', async function (req, res, next) {
    try {
        const review = new Review({
            title: req.body.title,
            date: req.body.date,
            rating: req.body.rating,
            idUser: req.body.idUser,
            idProduct : req.body.idProduct
        })
        await review.save();
        res.status(200).json({message: 'Tạo đánh giá thành công'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
});

router.post("/getReviewWithProduct", async function (req,res) {
    try {
        const review = await Review.find({idProduct: req.body.id})
            .populate("idUser")
            .populate({path: "idProduct", populate: [
                    { path: "idUser", model: "user" },
                    { path: "idCategory", model: "category" },
                ]});
        if (!review || review.length === 0) {
            return res.status(400).json({ message: 'Không có đánh giá nào' });
        }
        return res.status(200).json({ message: 'Lấy dữ liệu thành công', review });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
module.exports = router;
