const mongoose = require("mongoose");

const {Schema} = mongoose;


const userSchema = new Schema({
    username:{
        type:String,
        trim:true,
        required:true,
        minLength:[3,"username minLength is 3"]
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:[true,"email user is already register"],
        maxLength:[50,"email length must be less than 50"]
    },
    password:{
        type:String,
        required:true,
        minLength:[6,"password must at least 6 digits"]
    },
    profilePic:{
        type:String,
        default:""
    },
    wallet:{
        type:Number,
        default:0
    },
    verficationCode:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    contents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"content"
    }],
    lastOtpSend:{
        type:Date,
        default:null
    }
},{timestamps:true});



userSchema.post("save",(data)=>{
    console.log(data);
    if(data.verficationCode){
        setTimeout(async()=>{
             data.verficationCode = null;
             await data.save()
        },5 * 60 * 1000)
    }
})


module.exports = mongoose.model("user",userSchema);
