const exampleService = require('../service/auth.service');
const UserModel = require('../models/user.model')
const otpGenerator = require("otp-generator");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
require('../config/service_account.json')
const user_name     = 'hoanglong180903@gmail.com';
const refresh_token = '1//04MGP-yKTSpicCgYIARAAGAQSNwF-L9IrQSxRJTTgU3zu18nRlo3R-CooEdn6avKD9Gx2ehWBTEEyHbNiXFvX1iKSuM9gr4w4Ca0';
const access_token  = 'ya29.a0AZYkNZhIMKPwjiJfX8O8Qo0_vSC4G8IODakYubytuuu7-fqNGYjfwsy3P1R9VM5aaL4OWFsWTAmIqr-TtwitAqtVqXhgzWp0LA8C66lWp_FpBIJJfdALSZGJTtRVNdiGFIwAKNF78zcdNeBBA0Lg2mNmghzaeOrvtDNjdecraCgYKAQQSARASFQHGX2Mi5TlaDQwBtqYsKnk_xJYZ8g0175';
const client_id     = '876732120875-j0hlr6vduk0d0pgdhr1nnhvhlj6317ss.apps.googleusercontent.com';
const client_secret = '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';

const generateOTP = async (req, res) => {
    try {
        const { toEmail } = req.body;
        req.app.locals = {
            OTP: null,
            resetSession: false,
        };
        req.app.locals.OTP = otpGenerator.generate(4, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        let transporter = nodemailer
            .createTransport({
                service: 'Gmail',
                auth: {
                    type: 'OAuth2',
                    clientId: client_id,
                    clientSecret: client_secret
                }
            });
        transporter.on('token', token => {
            console.log('A new access token was generated');
            console.log('User: %s', token.user);
            console.log('Access Token: %s', token.accessToken);
            console.log('Expires: %s', new Date(token.expires));
        });

        let mailOptions = {
            from    : user_name,
            to      : toEmail,
            subject : 'OTP Verification ✔',
            text    : '',
            html    : `<!DOCTYPE html>
                          <html lang="en">
                              <head>
                                  <meta charset="UTF-8">
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                  <title>Verification OTP</title>
                                  <style>
                                      body {
                                          font-family: Arial, sans-serif;
                                          background-color: #f8f8f8;
                                          margin: 0;
                                          padding: 0;
                                      }
                                      .container {
                                          max-width: 600px;
                                          margin: 0 auto;
                                          background-color: #ffffff;
                                          border-radius: 5px;
                                          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                                      }
                                      .header {
                                          background-color: #0073e6;
                                          color: #ffffff;
                                          padding: 20px;
                                          text-align: center;
                                          border-top-left-radius: 5px;
                                          border-top-right-radius: 5px;
                                      }
                                      .content {
                                          padding: 20px;
                                          text-align: center;
                                      }
                                      .otp {
                                          font-size: 32px;
                                          font-weight: bold;
                                          color: #0073e6;
                                      }
                                      .footer {
                                          border: 1px dashed #cccccc;
                                          border-width: 2px 0;
                                          padding: 20px;
                                          text-align: center;
                                      }
                                      .footer a {
                                          color: #0073e6;
                                      }
                                      .footer a:hover {
                                          text-decoration: underline;
                                      }
                                  </style>
                              </head>
                              <body>
                                  <div class="container">
                                      <div class="header">
                                          <h1>Verification</h1>
                                          <p style="font-size: 14px;color: #ffffff;">
                                              You received this email because you requested an OTP.
                                          </p>
                                      </div>
                                      <div class="content">
                                          <p>Your One-Time Password (OTP) is:</p>
                                          <p class="otp">${req.app.locals.OTP}</p>
                                      </div>
                                      <div class="footer">
                                          <p>For more information, visit our GitHub repository:</p>
                                          <p><a href="https://github.com/doolong189" target="_blank">HoangLong</a></p>
                                      </div>
                                  </div>
                              </body>
                          </html>`,
            auth : {
                user         : user_name,
                refreshToken : refresh_token,
                accessToken  : access_token,
                expires      : 1494388182480
            }
        };
        let info = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            req.app.locals.resetSession = true
            console.log("Message sent: %s", info.messageId);
        });
        console.log(req.app.locals.resetSession)
        return res.status(200).send({ code: req.app.locals.OTP, info });
    } catch (error) {
        return res.status(500).send({ error: "Error while generating OTP" });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { code } = req.body;
        if (parseInt(req.app.locals.OTP) === parseInt(code)) {
            req.app.locals.OTP = null;
            req.app.locals.resetSession = true;
            console.log(req.app.locals.resetSession)
            return res.status(200).send({ message: "Xác nhận thành công" });
        }
        return res.status(400).send({ message: "Lỗi OTP" });
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi tạo mã OTP" });
    }
};

const resendOTP = async (req, res) => {
    console.log(req.app.locals.resetSession)
    if (req.app.locals.resetSession) {
        return res.status(200).send({ data: req.app.locals.resetSession });
    }
    return res.status(400).send({ error: "Lỗi gửi lại mã OTP" });
};

const resetPassword = async (req, res) => {
    try {
        const { toEmail } = req.body;
        req.app.locals = {
            Password: null,
            resetSession: false,
        };
        req.app.locals.Password = otpGenerator.generate(4, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        let transporterPassword = nodemailer
            .createTransport({
                service: 'Gmail',
                auth: {
                    type: 'OAuth2',
                    clientId: client_id,
                    clientSecret: client_secret
                }
            });
        transporterPassword.on('token', token => {
            console.log('A new access token was generated');
            console.log('User: %s', token.user);
            console.log('Access Token: %s', token.accessToken);
            console.log('Expires: %s', new Date(token.expires));
        });

        let mailOptions = {
            from    : user_name,
            to      : toEmail,
            subject : 'OTP Verification ✔',
            text    : '',
            html    : `<!DOCTYPE html>
                          <html lang="en">
                              <head>
                                  <meta charset="UTF-8">
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                  <title>New Password</title>
                                  <style>
                                      body {
                                          font-family: Arial, sans-serif;
                                          background-color: #f8f8f8;
                                          margin: 0;
                                          padding: 0;
                                      }
                                      .container {
                                          max-width: 600px;
                                          margin: 0 auto;
                                          background-color: #ffffff;
                                          border-radius: 5px;
                                          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                                      }
                                      .header {
                                          background-color: #0073e6;
                                          color: #ffffff;
                                          padding: 20px;
                                          text-align: center;
                                          border-top-left-radius: 5px;
                                          border-top-right-radius: 5px;
                                      }
                                      .content {
                                          padding: 20px;
                                          text-align: center;
                                      }
                                      .otp {
                                          font-size: 32px;
                                          font-weight: bold;
                                          color: #0073e6;
                                      }
                                      .footer {
                                          border: 1px dashed #cccccc;
                                          border-width: 2px 0;
                                          padding: 20px;
                                          text-align: center;
                                      }
                                      .footer a {
                                          color: #0073e6;
                                      }
                                      .footer a:hover {
                                          text-decoration: underline;
                                      }
                                  </style>
                              </head>
                              <body>
                                  <div class="container">
                                      <div class="header">
                                          <h1>Verification</h1>
                                          <p style="font-size: 14px;color: #ffffff;">
                                              You received this email because you requested a new password.
                                          </p>
                                      </div>
                                      <div class="content">
                                          <p>Your new password is:</p>
                                          <p class="otp">${req.app.locals.OTP}</p>
                                      </div>
                                      <div class="footer">
                                          <p>For more information, visit our GitHub repository:</p>
                                          <p><a href="https://github.com/doolong189" target="_blank">HoangLong</a></p>
                                      </div>
                                  </div>
                              </body>
                          </html>`,
            auth : {
                user         : user_name,
                refreshToken : refresh_token,
                accessToken  : access_token,
                expires      : 1494388182480
            }
        };
        let info = transporterPassword.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            req.app.locals.resetSession = true
            console.log("Message sent: %s", info.messageId);
        });
        return res.status(200).send({ code: req.app.locals.OTP, info });
    } catch (error) {
        return res.status(500).send({ error: "Error while generating OTP" });
    }
}

module.exports = {
    generateOTP, verifyOTP, resendOTP
}