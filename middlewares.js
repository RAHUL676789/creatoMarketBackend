const {userSchema} = require("./schema")
const jwt = require("jsonwebtoken")
const {contentSchema} = require("./schema")
const contentModel = require("./models/contentSchema");
 
// console.log(contentSchema)

module.exports.userSchemaValidation = (req,res,next)=>{
    const result = userSchema.validate(req.body);
   console.log(result.error?.details)
    if(result.error){
      return res.status(400).json({message:result.error?.details[0]?.message || "someting went wrong",success:false})
    }
    next();
}

module.exports.isLoggedIn = (req,res,next)=>{
 try {
  const token = req.cookies.token;
  if(!token){
   return res.status(400).json({message:"unauthorized user",success:false});
  }
  let validUser = jwt.verify(token,process.env.jwtsecret);
  console.log(validUser);
  if(validUser){
    next();
  }
 } catch (error) {
    return res.status(500).json({message:error.message || "something went wrong", success:false});
 }
}


module.exports.contentScheaValidation = (req,res,next)=>{
  
  const result = contentSchema.validate(req.body);

  if(result.error){
    return res.status(400).json({message:result.error?.details[0]?.message || "someting went wrong",success:false})
  }
  next();

}



module.exports.isOwnerOfContent = async(req,res,next)=>{
  const currUser = req.session.user._id;
  console.log(currUser);
  const {id} = req.body;
  if(!id){
    return res.status(400).json({message:"content id not found",success:false});
  } 
  const content = await contentModel.findById(id);
  console.log(content);
  if(!content){
    return res.status(400).json({message:"content not found",success:false});
  }
  if(content.owner != currUser){
    return res.status(400).json({message:"you are not owner of this content",success:false});
  }
  next();
}