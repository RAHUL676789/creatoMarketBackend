const {userSchema} = require("./schema")
const jwt = require("jsonwebtoken")
const {contentSchema} = require("./schema")
 
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