const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const broadbandpayhisSchema = new mongoose.Schema({
    userId : {
        type : String,
        ref: "User"
    },
    productId : {
        type : ObjectId,
        ref : "Broadband"
    },
    plantype : {
        type : String,
        trim : true,
        required : true,
        maxlength : 32,
        enum : ["Prepaid","Postpaid"]
    },
    planfrom : {
        type : Date  
    },
    plantill : {
        type : Date
    },
    referenceno : {
        type : String,
        trim : true,
        maxlength : 50
    },
    paymentstatus: {
        type : String,
        trim : true,
        required : true,
        maxlength : 32,
        enum : ["Paid","Open"]
    },
    amount : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        trim : true,
        required : true,
        maxlength : 32,
        enum : ["active","closed"]
    },
    isupgrade : {
        type : Number,
        default :0
    },
    planduration :{
        type :Number
    },
    usage :{
        type :String
    },
    cardId :{
        type : ObjectId,
        ref: "PaymentCard"
    }
},{timestamps :true})

module.exports = mongoose.model("BroadbandPayHistory",broadbandpayhisSchema);