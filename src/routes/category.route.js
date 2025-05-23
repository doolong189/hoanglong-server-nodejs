const express = require('express')
const categoryRouter = express.Router();
const {createCategory , getCategory} = require( "../controllers/category.controller.js")

categoryRouter.post("/createCategory" , createCategory)
categoryRouter.get("getCategory" , getCategory)

module.exports = categoryRouter;