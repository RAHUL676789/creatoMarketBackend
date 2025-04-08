const mongoose = require("mongoose");
const userModel = require("../models/userSchema")

const { Schema } = mongoose;


const contentSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: [true,"this title name is already exist"]
    },
    type:{
        type:String,
        required:[true,"this is required field"]

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
        default:""

    },
    url: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    likes: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Like"
    }],
    likeCount:{
       type:Number,
       default:0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review"
    }],
    downLoads: {
        type: Number,
        default: 0
    },
    publicId:{
        type:String,
        required:true
    }
})





contentSchema.post("findOneAndDelete",async(data)=>{
    if(data){
        console.log(data);
        const deleteFromUser = await userModel.findByIdAndUpdate(data.owner,{$pull:{contents:data._id}});
        console.log("deleteFromUser",deleteFromUser);
    }
})

module.exports = mongoose.model("content",contentSchema);