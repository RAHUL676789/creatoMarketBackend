const contentModel = require("../models/contentSchema");
const userSchema = require("../models/userSchema");
const cloudinary = require('../utils/cloudinary.js');




module.exports.getAll = async(req,res,next)=>{

    const allContent = await contentModel.find({}).populate({
        path:"owner",
        select:"-password"
    });
    res.status(200).json({message:"all content",success:true,data:allContent})
}


module.exports.create = async(req,res,next)=>{
    const {title,url,description,price,type,publicId} = req.body;
    console.log(url);
    const ownerUser = await userSchema.findById(req.session.user._id);
    const newContent = new contentModel({
        title,
        url,
        description:description || "",
        price: price || 0,
        type,
        publicId:publicId || "",
        
    })

    ownerUser.contents.push(newContent);
    newContent.owner=ownerUser._id;
    const content =  await newContent.save();
    ownerUser.save();

    res.status(200).json({message:"content-created",success:true,data:content});
}



module.exports.update = async(req,res,next)=>{
    const {id,title,description,price} = req.body;
    console.log(id,title,description,price);
    if(!id){
        return res.status(400).json({message:"content id not found",success:false});
    }
    if(!title || !description || !price){
        return res.status(400).json({message:"please provide all the fields",success:false});
    }
    const updateContent = await contentModel.findByIdAndUpdate(id,{
        title,
        description,
        price
    },{new:true});
    console.log(updateContent);
    if(!updateContent){
        return res.status(400).json({message:"content not found",success:false});
    }
    res.status(200).json({message:"content-updated",success:true,data:updateContent});  
}




module.exports.deleteContent = async(req,res,next)=>{
    const {id} = req.body;
   if(!id){
    return res.status(400).json({message:"content id not found",success:false});
   }
    const content = await contentModel.findByIdAndDelete(id);
    if (content.publicId) {
        
        let deleteResult =    await cloudinary.uploader.destroy(content.publicId);
        if(deleteResult.result !== "ok"){
            return res.status(400).json({message:"content not found",success:false});
        }else{
            return res.status(200).json({message:"content deleted",success:true,data:content});
        }
        
      
    }else{
        return res.status(400).json({message:"public id not found",success:false});
    }
  
   

}




module.exports.CancelContent = async(req,res,next)=>{
 
    const {publicId} = req.body;

    if(!publicId){
        return res.status(400).json({message:"content id not found",success:false});
    }

   let cloudResult = await cloudinary.uploader.destroy(publicId)
   if(cloudResult.result !== "ok"){
    return res.status(400).json({message:"content not found",success:false});
   }
   res.status(200).json({message:"content deleted",success:true,data:cloudResult});
    
}




