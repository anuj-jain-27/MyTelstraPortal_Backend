const mongoose  = require('mongoose')
const {ObjectId} = mongoose.Schema;

const productCartSchema  = new mongoose.Schema({
    product : {
        type : ObjectId,
        ref : "Product"
    },
    name : String,
    count : Number,
    price : Number,
    
})

const ProductCart = mongoose.model("ProductCart",productCartSchema)


const orderSchema = new mongoose.Schema({
    products: [productCartSchema],
    transaction_id:{
        type : String,
        trim : true,
        maxlength : 50
    },
    amount:{type:Number},
    address : String,
    status : {
      type : String,
      default : "Recieved"  ,
      enum : ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]      
    },
    error :{
        type : String,
        trim : true,
        maxlength : 50
    },
    updated : Date,
    user: {
        type : String,
        ref: "User"
    },
    cardId :{
        type : ObjectId,
        ref: "PaymentCard"
    }
},{timestamps:true})

const Order = mongoose.model("Order",orderSchema)

module.exports = {Order,ProductCart};