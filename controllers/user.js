const User = require("../models/user")
const {Order} = require("../models/order")


exports.getUserById = (req,res,next,id)=>{
  User.findById(id).exec((err,user)=>{
      if(err || !user){
           return res.status(400).json({
               error : "No user in database"
           })
      }

      req.profile = user;
      next();
  })
}

exports.getUser = (req,res) => {
    // req.profile is populated using getUserById
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
}

exports.getAllUsers = (req,res)=>{
    User.find({}).exec((err,users)=>{
        if(err || !users){
            return res.status(400).json({
                error : "No users in database"
            })
       }
       res.json(users)
    })
}

exports.userPurchaseList = (req,res)=>{
   
    Order.find({user : req.profile._id},(err,order) =>{
            if(err){
                return res.status(400).json({
                    error : "No orders in this account"
                })
            }
            console.log(order)
            return res.json(order)
    })
}

exports.pushOrderInPurchaseList = (req,res,next)=>{
    
    let purchases = []
    req.body.order.products.forEach(prod => {
        purchases.push({
            _id : prod._id,
            name : prod.name,
            description : prod.description,
            category : prod.category,
            quantity : prod.count,
            amount : req.body.order.amount,
            transaction_id : req.body.order.transaction_id 
        })
    })
    
    User.findOneAndUpdate(
        
               {_id : req.profile._id},
               {$push : {purchases : purchases}},
               {new : true},
               (err,purchases) => {
                   if(err) {
                       return res.status(400).json({
                           error : "Unable to save purchase list"
                       })
                   }
                   next();
               }
    )
}

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate({_id : req.profile._id},
        {$set : req.body},
        {new :true , useFindAndModify : false},
        (err,user) => {
            if(err){
                return res.status(400).json({
                    error : "Not authorized to update the user" 
                })
            }
            // user.salt = undefined;
            // user.encry_password = undefined;
            res.json(user);
        })
}
