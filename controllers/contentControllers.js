const contentModel = require("../models/contentSchema");
const likeModel = require("../models/likeSchema.js");
const userSchema = require("../models/userSchema");
const { asynwrap } = require("../utils/asynwrap.js");
const cloudinary = require('../utils/cloudinary.js');




module.exports.getAll = async(req,res,next)=>{

    const allContent = await contentModel.find({}).populate({
        path:"owner",
        select:"-password"
    }).populate({
        path:"likes"
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









// likeBuffer: { content: { liked: true/false, timer: setTimeout } }
  let likeBuffer = {};

module.exports.likes = async(req,res,next)=>{
    
    const {userId,content,likeStatus} = req.body;
    console.log(req.body);
  

    if(!likeBuffer[content]){
        likeBuffer[content] = {likeCount : likeStatus == true ? 1 : -1 ,time:null}
    }else{
        likeBuffer[content].likeCount += likeStatus == true ? 1 : -1  ;
        clearTimeout(likeBuffer[content].timer)
    }

    likeBuffer[content].timer = setTimeout(async()=>{
      try {
        let result = await  updateDbLike(content,likeBuffer[content].likeCount);
        if(result.success){
        let like =    await likeModel.create({content,userId})
        console.log(like)
        let contentSave = await contentModel.findByIdAndUpdate(content,{$push:{likes:like._id}});
        
          
        }else{
            await likeModel.findOneAndDelete(content,userId);
        }

      } catch (error) {
        console.log(error)
      }
        delete likeBuffer[content];
    },2000)

    return res.status(200).json({success:true});
}


const updateDbLike = async  (content,likeCount) => {
     
  try{
    let result = await contentModel.findByIdAndUpdate(content,{$inc:{likeCount:likeCount}});
    return {success:true};
  }catch(e){
    console.log(e);
    return {success:false};
  }
}