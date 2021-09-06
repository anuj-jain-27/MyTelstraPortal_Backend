const fetch = require("node-fetch");
const {Order,ProductCart} = require("../models/order")

const sysconfig = require("../config/systemconfig")

exports.getOrderById = (req,res,next,id) => {
 
    Order.findById(id)
    .populate("products.product","name price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error : "No order found in database"
            })
        }

        req.order = order
        next()
    })
}

exports.createOrder = (req,res) => {
    req.body.order.user = req.profile._id
    req.body.order.cardId = req.paymentcard._id
    const order = new Order(req.body.order)
    
    order.save((err,order)=>{
      if(err){
          return res.status(400).json({
              error : err //"Unable to save order in database"
          })
      }
      var fetchOption ={
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                _id : order._id,
                price: order.amount,
                cardnumber : req.paymentcard.cardnumber,
                expirydate : req.paymentcard.expirydate,
                cvv : req.body.cvv
            })
        }

        ///Payment Gateway Call
        fetch(sysconfig.paymentgateway,fetchOption)
                .then(response=>response.json())
                .then(paymentresponse=>{
                    var updateobj;
                    if(paymentresponse.status === false){
                        updateobj ={
                            status : "Cancelled",
                            error : paymentresponse.error
                        }
                    }else{
                        updateobj ={
                            status : "Processing",
                            transaction_id : paymentresponse.referenceno
                        }
                    }
                    Order.findOneAndUpdate(
                        {_id : paymentresponse._id},
                        {$set : updateobj},
                        {new: true},
                        (err,orderdetails) =>{
                            if(err){
                                return res.status(400).json({
                                    error : "Error while updating plans"
                                })
                            }
                            if(paymentresponse.status === false){
                                res.json({
                                    message :"Payment failed, if amount is debited from your account it will be rolled backed soon"
                                })
                            }else{
                                res.json(orderdetails)  
                                ///cart cleanup remaining
                            }
                            
                        }
                    )

                })
                .catch((err)=>{
                    return res.status(404).json({
                        error : "Error Occured while Connecting to Payment GAteway server"
                    })
                })
    //   res.json(order)  
    })
}

exports.getAllOrders = (req,res) => {

    Order.find().populate("user", "_id name").exec((err,orders)=>{
        if(err){
             return res.status(400).json({
                 error : "No orders present in database"
             })
        }
        res.json(orders)
    })
}

exports.getOrderStatus = (req,res) => {
    res.json(Order.schema.path("status").enumValues)
}

exports.updateStatus = (req,res) =>{
    Order.findOneAndUpdate(
        {_id : req.order._id},
        {$set : {status : req.body.status}},
        {new: true},
        (err,order)=>{
            if(err){
                return res.status(400).json({
                    err : "Unable to update the status of order to database"
                })
            }
            res.json(order)
        }
    )
}