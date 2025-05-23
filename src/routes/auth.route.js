const express = require('express');
const router = express.Router();
const {generateOTP, verifyOTP,resendOTP} = require('../controllers/auth.controller');
// Define your routes
router.post("/generateOTP" , generateOTP)
router.post("/verifyOTP" , verifyOTP)
router.get("/resendOtp" , resendOTP)
// Add more routes as needed

module.exports = router;