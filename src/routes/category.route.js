const express = require('express')
const {createCategory , getCategory} = require( "../controllers/category.controller.js")
const categoryRouter = express.Router();

categoryRouter.post("/createCategory" , createCategory)
categoryRouter.get("getCategory" , getCategory)

module.exports = categoryRouter;