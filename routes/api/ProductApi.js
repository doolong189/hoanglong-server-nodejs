var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../../models/Product')
const Product = mongoose.model("product");
const User = mongoose.model("user")
router.post('/createProduct', async function (req, res, next) {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
        discount : req.body.discount,
      description: req.body.description,
      image: req.body.image,
      idUser: req.body.idUser,
      idCategory: req.body.idCategory,
    })
    const savedProduct = await product.save(); 
    const populatedProduct = await Product.findById(savedProduct._id)
        .populate("idUser")
        .populate("idCategory")
    res.send(populatedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).send(err); 
  }
});

router.put("/updateProduct/:id", async (req, res) => {
  try {
    const data = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!data) {
      return res.status(404).json({ message: "update failed" });
    } else {
      return res.status(200).json({ message: "update successful" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const data = await Product.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "delete failed" });
    } else {
      return res.status(200).json({ message: "delete successful" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/getProduct", async (req, res) => {
  try {
    const maUser = req.body.id;
    const products = await Product.find({idUser: { $ne: maUser }})
        .populate("idUser")
        .populate("idCategory")
        if (!products) {
          return res.status(400).json({ message: "Không có dữ liệu" });
        }else if(products.length == 0){
          return res.status(400).json({ message: "Không tìm thấy sản phẩm" });
        } else {
          return res.status(200).json({ message: "Lấy dữ liệu thành công", products });
        }
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
})

router.get("/getMyProduct/:id", async (req, res) => {
  try {
    const maUser = req.params.id;
    const product = await Product.find({idUser: maUser})
        .populate("idUser")
        .populate("idCategory")
    res.json(product)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
})

router.post("/getProductWithCategory" , async(req,res) => {
  try {
    const { idCategory , idUser } = req.body; // Lấy idBrand từ body

    // Tạo đối tượng điều kiện tìm kiếm
    const query = { idUser: { $ne: idUser } };
    
    // Nếu idBrand được truyền vào, thêm điều kiện lọc theo idBrand
    if (idCategory) {
      query.idCategory = idCategory;
    }

    const products = await Product.find(query)
      .populate("idUser")
      .populate("idCategory");
    res.json({message : "Lấy dữ liệu thành công", products});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})


router.post("/getProductSimilar" , async(req,res) => {
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
})


router.post("/getDetailProduct", async (req, res) => {
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
})

router.post('/searchLocationProduct', async (req, res) => {
  const { loc, radius, userId } = req.body;  

  if (!loc || !radius || !userId) {
    return res.status(400).json({ message: 'Vui lòng cung cấp tọa độ, bán kính và userId' });
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

    res.status(200).json(products);
  } catch (error) {
    console.error('Error finding products:', error);
    res.status(500).json({ message: 'Lỗi khi tìm sản phẩm' });
  }
});

module.exports = router;
