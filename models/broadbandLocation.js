const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const broadbandSchema = new mongoose.Schema({
    suburb :{
        type : String,
        trim : true,
        required : true,
        maxlength : 32
    },
    city : {
        type : String,
        trim : true,
        required : true,
        maxlength : 32
    },
    state :{
        type : String,
        trim : true,
        required : true,
        maxlength : 32
    },
    postalcode :{
        type : Number,
        trim : true,
        required : true,
        minlength : 4,
        maxlength : 10
    },
    availableplans :[{
        type : ObjectId,
        ref : "broadband"
    }]
},{timestamps :true})

module.exports = mongoose.model("BroadbandLocation",broadbandSchema);