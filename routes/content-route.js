const express = require("express");
const { contentScheaValidation, isLoggedIn } = require("../middlewares");
const { create } = require("../controllers/contentControllers");
const Router = express.Router({mergeParams:true});
const {asynwrap} = require("../utils/asynwrap")



Router.route("/create")
.post(isLoggedIn,contentScheaValidation,asynwrap(create));



module.exports = Router;