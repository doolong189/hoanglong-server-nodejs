const express = require('express');
const router = express.Router();
const UserModel = require('../../models/User')
const otpGenerator = require("otp-generator");
const mongoose = require("mongoose");

router.get("/generateOTP", async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        req.app.locals = {
            OTP: null,
            resetSession: false,
        };
        req.app.locals.OTP = otpGenerator.generate(4, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log(req.app.locals.resetSession)
        res.status(200).send({ code: req.app.locals.OTP });
    } catch (error) {
        res.status(500).send({ error: "Error while generating OTP" });
    }
});
router.get("/verifyOTP", async (req, res) => {
    try {
        const { id , code } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (parseInt(req.app.locals.OTP) === parseInt(code)) {
            req.app.locals.OTP = null;
            req.app.locals.resetSession = true;
            console.log(req.app.locals.resetSession)
            return res.status(200).send({ msg: "Verify Successfully!" });
        }
        return res.status(400).send({ error: "Invalid OTP" });
    } catch (error) {
        res.status(500).send({ error: "Error while generating OTP" });
    }
});

router.get("/resendOTP", async (req, res) => {
    console.log(req.app.locals.resetSession)
    if (req.app.locals.resetSession) {
        return res.status(200).send({ flag: req.app.locals.resetSession });
    }
    return res.status(440).send({ error: "Session expired!" });
});
module.exports = router;
