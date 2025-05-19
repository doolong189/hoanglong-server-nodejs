const express = require( 'express');
const userRouter = express.Router();
const {register, login, changePassword, updateLocation, getUsers, getUserInfo, updateLocationUser, updateToken, updateUser, statistical
} = require( "../controllers/user.controller.js");

userRouter.post('/register', register);

userRouter.post('/login', login);

userRouter.post("/change-password/:id", changePassword)

userRouter.post('/update-location/:id', updateLocation);

userRouter.post("/getUsers", getUsers);

userRouter.post("/getUserInfo", getUserInfo);

userRouter.put("/updateLocationUser/:id", updateLocationUser)

userRouter.post("/updateToken", updateToken)

userRouter.put("/updateUser/:id", updateUser)

userRouter.post('/statistical', statistical);


module.exports = userRouter