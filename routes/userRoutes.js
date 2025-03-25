const express = require("express");
const { signup, login, updateProfile, profile, verifyOtp,resendOtp } = require("../controllers/userController");
const Router = express.Router({mergeParams:true});
const {asynwrap} = require("../utils/asynwrap");
const {userSchemaValidation, isLoggedIn} = require("../middlewares.js")


Router.route("/profile")
.get(isLoggedIn,profile);


Router.route("/signup")
.post(userSchemaValidation,asynwrap(signup));


Router.route("/verify")
.post(asynwrap(verifyOtp));


Router.route("/re-send-otp")
.get(asynwrap(resendOtp));

Router.route("/login")
.post(asynwrap(login));

Router.route("/update")
.put(asynwrap(updateProfile));



module.exports = Router;