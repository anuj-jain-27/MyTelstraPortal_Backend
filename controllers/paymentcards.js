const PaymentCard = require("../models/paymentcards")

exports.getUserCardById = (req,res,next,id)=>{
    PaymentCard.findById(id).exec((err,card)=>{
        if(err || !card){
             return res.status(400).json({
                 error : "No user in database"
             })
        }
        req.paymentcard = card;
        next();
    })
}

exports.getAllUserCards = (req,res)=>{
    PaymentCard.find({userId : req.profile._id})
    .exec((err,cards) =>{
            if(err){
                return res.status(400).json({
                    error : "No cards available for the user"
                })
            }
            return res.json(cards)
    })
}

exports.addUserCards =(req,res) =>{
    var card = new PaymentCard({
        ...req.body,
        "userId" : req.profile._id
    })
    card.save((err,result)=>{
        if(err){
            return res.status(400).json({
                error : "Could Not Add Card to User"
            })
        }
        res.json(result);
    })
}


//update delete