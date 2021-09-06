const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const paymentcards = new mongoose.Schema({
    userId :{
        type : String,
        ref: "User"
    },
    cardtype:{
        type : String,
    },
    cardnumber:{
        type:Number
    },
    expirydate:{
        type:String,
        maxlength : 5
    },
    // 1 new field added
    cardname:{
        type:String
    },
})
module.exports = mongoose.model("PaymentCard",paymentcards);