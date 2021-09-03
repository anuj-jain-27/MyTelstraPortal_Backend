const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

var dataSchema = new mongoose.Schema({

   day:{
        type : Number,
        required : true,
      
    },
   dc:{
        type : Number,
        required : true,
       
    },
},{timestamps : true})


module.exports = mongoose.model("DataConsumption", dataSchema);