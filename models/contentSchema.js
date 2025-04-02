const mongoose = require("mongoose");

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
        ref: "user"
    },
    description: {
        type: String,

    },
    url: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
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




module.exports = mongoose.model("content",contentSchema);