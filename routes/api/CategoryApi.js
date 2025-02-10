var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../../models/Category')
const Category = mongoose.model("category");

router.post('/addCategory', async function (req, res, next) {
  try {
    const category = new Category({
      name: req.body.name,
      image: req.body.image,
    })
    const savedCategory = await category.save(); 
    const populatedCategory = await Category.findById(savedCategory._id)
    res.send(populatedCategory);
  } catch (err) {
    console.log(err);
    res.status(500).send(err); 
  }
});

router.get('/getCategory', async (req, res) => {
  try {
    const categorys = await Category.find()
    if(categorys.length == 0){
      return res.status(200).json({ message: 'Danh sách trống'});
    }
      return res.status(200).json({ message: 'Lấy dữ liệu thành công', categorys });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})
module.exports = router;
