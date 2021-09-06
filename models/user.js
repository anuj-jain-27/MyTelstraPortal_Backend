const mongoose = require('mongoose');
const crypto = require('crypto')
const {ObjectId} = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

var userSchema = new mongoose.Schema({
    _id :{
        type : String
     },
    name:{
        type : String,
        required:true,
        maxlength: 32,
        trim:true
    },
    lastname: {
        type:String,
        maxlength:32,
        trim:true
    },
    email: {
    type: String,
    trim: true,
    required:true,
    unique : true
    },
    googleId : {
     type : String
    },
    userinfo :{
        type : String,
        trim : true
    },
    // encry_password : {
    //     type : String,
    //     required : true 
    // },
    salt : String,
    role : {
        type : Number,
        default : 0
    },
    purchases : {
        type : Array,
        default : [] 
    },
    cart:[{
        product:{type : ObjectId,ref : "Product"},
        quantity:{type:Number}
    }]
}, {timestamps :true});

userSchema.virtual("password")
.set(function(password){
   this._password = password
   this.salt = uuidv4(); 
   this.encry_password = this.securePassword(password)
})
.get(function(){
    return this._password
})

userSchema.methods = {
    
    authenticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password
    },
    securePassword : function (plainpassword){
        if(!plainpassword) return "";
        try{
            return  crypto.createHmac('sha256', this.salt)
               .update(plainpassword)
               .digest('hex');

        }catch(err){
            return "";
        }
    }
}


module.exports = mongoose.model("User",userSchema);


/*const mongoose = require('mongoose');
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid');

var userSchema = new mongoose.Schema({
     
    name:{
        type : String,
        required:true,
        maxlength: 32,
        trim:true
    },
    lastname: {
        type:String,
        maxlength:32,
        trim:true
    },
    googleID: String,
    email: {
    type: String,
    trim: true,
    required:true,
    unique : true
    },
     mobnumber: {
    type: String,
    trim: true,
    required:true,
    unique : true
    },
    userinfo :{
        type : String,
        trim : true
    },
    // encry_password : {
    //     type : String,
    //     required : false 
    // },
    googleId : {
        type : String
    },
    salt : String,
    role : {
        type : Number,
        default : 0
    },
    purchases : {
        type : Array,
        default : [] 
    },
    address : [{
      fullname:{type:String,default:""},
      street:{type:String,default:""},
      city:{type:String,default:""},
      state:{type:String,default:""},
      zipcode:{type:String,default:""}, 
    }],
}, {timestamps :true});

userSchema.virtual("password")
.set(function(password){
   this._password = password
   this.salt = uuidv4(); 
   this.encry_password = this.securePassword(password)
})
.get(function(){
    return this._password
})

userSchema.methods = {
    
    authenticate : function(plainpassword){
        //return this.securePassword(plainpassword) === this.encry_password
        return plainpassword=== this.encry_password
    },
    securePassword : function (plainpassword){
        if(!plainpassword) return "";
        try{
            return  crypto.createHmac('sha256', this.salt)
               .update(plainpassword)
               .digest('hex');

        }catch(err){
            return "";
        }
    }
}


module.exports = mongoose.model("User",userSchema);
*/