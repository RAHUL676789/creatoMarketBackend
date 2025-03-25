const contentModel = require("../models/contentSchema");
const userSchema = require("../models/userSchema");



module.exports.create = async(req,res,next)=>{
    const {title,url,description,price,type} = req.body;
    const ownerUser = await userSchema.findById(req.session.user._id);
    const newContent = new contentModel({
        title,
        url,
        description:description || "",
        price: price || 0,
        type,
        
    })

    ownerUser.contents.push(newContent);
    newContent.owner=ownerUser._id;
    const content =  await newContent.save();
    ownerUser.save();

    res.status(200).json({message:"content-created",success:true,data:content});
}