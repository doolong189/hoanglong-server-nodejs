const express = require( 'express');
const userRouter = express.Router();
const {register, login, changePassword, updateLocation, getUsers, getUserInfo, updateLocationUser, getNeedToken, updateUser, loginWithGoogle
} = require( "../controllers/user.controller.js");

userRouter.post('/register', register);

userRouter.post('/login', login);

userRouter.post("/change-password/:id", changePassword)

userRouter.post('/update-location/:id', updateLocation);

userRouter.post("/getUsers", getUsers);

userRouter.post("/getUserInfo", getUserInfo);

userRouter.put("/updateLocationUser/:id", updateLocationUser)

userRouter.post("/getNeedToken", getNeedToken)

userRouter.put("/updateUser/:id", updateUser)

userRouter.post('/loginWithGoogle', loginWithGoogle);

module.exports = userRouter