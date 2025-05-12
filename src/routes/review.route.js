const express = require( 'express')
const reviewRouter = express.Router();
const {createReview, getReviewWithProduct} = require( '../controllers/review.controller.js')

reviewRouter.post('/createReview', createReview);

reviewRouter.post("/getReviewWithProduct", getReviewWithProduct);
module.exports = reviewRouter