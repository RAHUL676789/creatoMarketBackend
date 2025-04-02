const express = require("express");
const { contentScheaValidation, isLoggedIn, isOwnerOfContent } = require("../middlewares");
const { create, update,deleteContent} = require("../controllers/contentControllers");
const Router = express.Router({mergeParams:true});
const {asynwrap} = require("../utils/asynwrap")



Router.route("/create")
.post(isLoggedIn,contentScheaValidation,asynwrap(create));

Router.route("/update")
.patch(isLoggedIn,isOwnerOfContent,asynwrap(update));

Router.route("/delete")
.delete(isLoggedIn,isOwnerOfContent,asynwrap(deleteContent));



module.exports = Router;