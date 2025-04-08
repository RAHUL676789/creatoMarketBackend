const mongoose = require('mongoose');
const { findByIdAndUpdate } = require('./userSchema');

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,


    },
    content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'content',
        required: true,
    }
  
  
},{timestamps:true});


likeSchema.post(findByIdAndUpdate,(data)=>{
    if(data){
        
    }
})

module.exports = mongoose.model('Like', likeSchema);