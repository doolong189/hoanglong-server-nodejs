const Product = require("../models/product.model.js")
const User = require("../models/user.model.js")
exports.createProduct = async (req, res, next) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            discount : req.body.discount,
            description: req.body.description,
            image: req.body.image,
            imageDetail: req.body.imageDetail,
            idUser: req.body.idUser,
            idCategory: req.body.idCategory,
        })
        const savedProduct = await product.save();
        await Product.findById(savedProduct._id)
            .populate("idUser")
            .populate("idCategory")
        return res.status(200).send({ message : "Tạo sản phẩm thành công "});
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: err.message});
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const data = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!data) {
            return res.status(400).json({ message: "Cập nhật thất bại" });
        } else {
            return res.status(200).json({ message: "Cập nhật thành công" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const data = await Product.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(400).json({ message: "Xóa thất bại" });
        } else {
            return res.status(200).json({ message: "Xóa thành công" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const maUser = req.body.id;
        const products = await Product.find({idUser: { $ne: maUser }})
            .populate("idUser")
            .populate("idCategory")
        if (!products || products.length === 0) {
            return res.status(400).json({ message: "Sản phẩm trống" });
        }
        return res.status(200).json({ message: "Lấy dữ liệu thành công", products });
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

exports.getMyProduct = async (req, res) => {
    try {
        const maUser = req.params.id;
        const product = await Product.find({idUser: maUser})
            .populate("idUser")
            .populate("idCategory")
        if (!product || product.length === 0) {
            return res.status(400).json({ message: "Sản phẩm trống" });
        }
        return res.status(200).json({ message: "Lấy dữ liệu thành công" , product})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

exports.getProductWithCategory =  async(req,res) => {
    try {
        const { idCategory , idUser } = req.body;
        const query = { idUser: { $ne: idUser } };
        if (idCategory) {
            query.idCategory = idCategory;
        }
        const products = await Product.find(query)
            .populate("idUser")
            .populate("idCategory");
        if (!products || products.length === 0) {
            return res.status(400).json({ message: "Sản phẩm trống" });
        }
        return res.status(200).json({message : "Lấy dữ liệu thành công", products});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.getProductSimilar =  async(req,res) => {
    try {
        const maUser = req.body.idUser;
        const maProduct = req.body.idProduct;
        const { idCategory } = req.query;
        const query = {
            idUser: { $ne: maUser },
            _id: { $ne: maProduct }
        };
        if (idCategory) {
            query.idCategory = idCategory;
        }
        const products = await Product.find(query)
            .populate("idUser")
            .populate("idCategory");
        if(!products){
            return res.status(400).json({ message: "Không tìm thấy sản phẩm nào" });
        }
        return res.status(200).json({message : "Lấy dữ liệu thành công", products});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.getDetailProduct = async (req, res) => {
    try {
        const data = await Product.findOne({_id: req.body.id})
            .populate('idUser')
            .populate('idCategory')
        if (!data) {
            return res.status(400).json({ message: 'Không tìm thấy sản phẩm' });
        }
        return res.status(200).json({ message: 'Lấy dữ liệu thành công', data });
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

exports.searchLocationProduct =  async (req, res) => {
    const { loc, radius, userId } = req.body;

    if (!loc || !radius || !userId) {
        return res.status(400).json({ message: 'Vui lòng cung cấp tọa độ, bán kính và mã người dùng' });
    }

    try {
        const users = await User.find({
            loc: {
                $geoWithin: {
                    $centerSphere: [loc, radius / 6378.1]
                }
            }
        });

        const userIds = users
            .map(user => user._id)
            .filter(id => id.toString() !== userId);

        if (userIds.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng nào khác trong phạm vi' });
        }

        const products = await Product.find({
            idUser: { $in: userIds }
        }).populate('idUser').populate('idCategory');

        return res.status(200).json({message : "Lấy dữ liệu thành công", products});
    } catch (error) {
        console.error('Error finding products:', error);
        res.status(500).json({ message: 'Lỗi khi tìm sản phẩm' });
    }
}

