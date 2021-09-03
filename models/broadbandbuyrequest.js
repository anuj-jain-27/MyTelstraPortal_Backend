const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const broadbandSchema = new mongoose.Schema({
    user: {
        type : String,
        ref: "User"
    },
    broadband : {
        type : ObjectId,
        ref : "Broadband"
    },
    existingplanId :{
        type : ObjectId,
        ref : "BroadbandPayHistory"
    },
    cardId :{
        type : ObjectId,
        ref : "PaymentCard"
    },
    address :{
        type : String,
        trim : true,
        required : true,
        maxlength : 500
    },
    status :{
        type : String,
        default : "Initialize",
        enum : ["Initialize","Success","Failed"],
        required : true
    },
    error :{
        type : String,
        trim : true,
        required : false
    },
    plantype :{
        type : String,
        trim : true,
        required : false,
        maxlength : 32,
        enum : ["Prepaid","Postpaid"]
    },
    amount : {
        type : Number,
        required : true
    },
    transactionrefno :{
        type : String,
        trim : false,
        maxlength : 50
    },
    dueamount :{
        type : Number,
        required : false
    },
    isUpgrade :{
        type : Number,
        default :0
    },
    planduration:{
        type : Number
    },
    plandata :{
        type : Number
    },
    cardId :{
        type : ObjectId,
        ref: "PaymentCard"
    }
},{timestamps :true})


module.exports = mongoose.model("BroadbandRequest",broadbandSchema);