const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema({
    plan:{
        type : Number,
        trim : true,
    },
    validity: {
        type : Number,
        trim : true,
        required : true,
        maxlength : 2000
    },
    data : {
        type : Number,
        trim : true,
       required : true,
        maxlength : 32
    },
    SMS: {
        type : Number,
       
    },
    cost :{
        type : Number,
        default : 0
    },
  
   
},{timestamps : true})


module.exports = mongoose.model("PostMessage",postSchema);