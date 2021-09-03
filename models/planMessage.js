const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const planSchema = new mongoose.Schema({

    plan_schema:{
        type : ObjectId,
        ref: "PostMessage"
    },
    user: {
        type : String,
        ref: "User"
    },
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
    transaction_id:{
        type : String,
        trim : true,
        maxlength : 50
    },
    status : {
        type : String,
        enum : ["Success", "Failed"]
    },
    cardId :{
        type : ObjectId,
        ref: "PaymentCard"
    },
    error :{
        type : String,
        trim : true,
        maxlength : 50
    }
  
   
},{timestamps : true})


module.exports = mongoose.model("PlanMessage",planSchema);

