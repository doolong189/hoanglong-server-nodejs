const Review = require("../models/review.model.js")

exports.createReview =  async function (req, res, next) {
    try {
        const review = new Review({
            title: req.body.title,
            date: req.body.date,
            rating: req.body.rating,
            idUser: req.body.idUser,
            idProduct : req.body.idProduct
        })
        await review.save();
        return res.status(200).json({message: 'Tạo đánh giá thành công'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: error.message});
    }
}

exports.getReviewWithProduct = async function (req,res) {
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
}
