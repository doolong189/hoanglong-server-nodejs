const Category = require("../models/category.model.js");

const createCategory =  async function (req, res) {
  try {
    const category = new Category({
      name: req.body.name,
      image: req.body.image,
    })
    const savedCategory = await category.save();
    const populatedCategory = await Category.findById(savedCategory._id)
    return res.status(200).send(populatedCategory);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find()
    if (!categories || categories.length === 0) {
      return res.status(400).json({ message: "Hạng mục trống"  });
    }
      return res.status(200).json({ message: 'Lấy dữ liệu thành công', categories: categories });
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory, getCategory
}