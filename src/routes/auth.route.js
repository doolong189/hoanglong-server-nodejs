const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Define your routes
router.get("/generateOTP" , authController.generateOTP)
router.get("/verifyOTP" , authController.verifyOTP)
// Add more routes as needed

module.exports = router;