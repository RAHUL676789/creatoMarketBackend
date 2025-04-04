const express = require("express");
const { contentScheaValidation, isLoggedIn, isOwnerOfContent } = require("../middlewares");
const { create, update,deleteContent, CancelContent,getAll} = require("../controllers/contentControllers");
const Router = express.Router({mergeParams:true});
const {asynwrap} = require("../utils/asynwrap")


Router.route("/getAll")
.get(asynwrap(getAll))
Router.route("/create")
.post(isLoggedIn,contentScheaValidation,asynwrap(create));

Router.route("/update")
.patch(isLoggedIn,isOwnerOfContent,asynwrap(update));

Router.route("/delete")
.delete(isLoggedIn,isOwnerOfContent,asynwrap(deleteContent));

Router.route("/Cancel")
.delete(isLoggedIn,asynwrap(CancelContent));



module.exports = Router;