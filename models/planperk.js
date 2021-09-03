const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const PlanPerksSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : true,
        maxlength : 32
    },
    description :{
        type : String,
        trim : true,
        required : true,
        maxlength : 500
    }
},{timestamps :true})

module.exports = mongoose.model("Planperk",PlanPerksSchema);