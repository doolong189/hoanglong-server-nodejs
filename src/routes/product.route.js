const express = require('express')
const productRouter = express.Router();
const {createProduct, updateProduct, deleteProduct, getProduct, getMyProduct, getProductWithCategory, getProductSimilar,
  getDetailProduct, searchLocationProduct
} = require('../controllers/product.controller.js')
productRouter.post('/createProduct', createProduct);

productRouter.put("/updateProduct/:id", updateProduct);

productRouter.delete("/deleteProduct/:id", deleteProduct);

productRouter.post("/getProduct", getProduct)

productRouter.get("/getMyProduct/:id", getMyProduct)

productRouter.post("/getProductWithCategory" , getProductWithCategory)

productRouter.post("/getProductSimilar" , getProductSimilar)

productRouter.post("/getDetailProduct", getDetailProduct)

productRouter.post('/searchLocationProduct', searchLocationProduct);

module.exports = productRouter