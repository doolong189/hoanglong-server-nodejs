const {getCategory} = require("../controllers/category.controller.js")

const express = require('express')
const {createCategory} = require( "../controllers/category.controller.js")
const categoryRouter = express.Router();

categoryRouter.post("/createCategory" , createCategory)
categoryRouter.get("getCategory" , getCategory)

module.exports = categoryRouter;