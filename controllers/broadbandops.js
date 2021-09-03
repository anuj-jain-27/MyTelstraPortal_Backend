const fetch = require("node-fetch");
const BroadbandPayHistory = require("../models/broadbandpayhistory")
const BroadbandRequest = require("../models/broadbandbuyrequest")
const Broadband = require("../models/broadband");

const sysconfig = require("../config/systemconfig")

//Buy BroadBandPlan
exports.buynewbroadband = (req,res) =>{
    var amountcalc;
    //Amount Calculation
    amountcalc = req.broadband.monthlyprice + req.broadband.installationcharges;
    
    var request = new BroadbandRequest({
        "user" : req.profile._id,
        "broadband" : req.broadband._id,
        "address" : req.body.address,
        "amount" : amountcalc,
        "plantype" : req.broadband.plantype,
        "dueamount" :0,
        "planduration" : req.broadband.validity,
        "plandata" : req.broadband.data,
        "cardId" : req.paymentcard._id
    })

    request.save((err,requestdata)=>{
        if(err){
            return res.status(404).json({
                error : "Buy broadband request failed"
            })
        }
        var fetchOption ={
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                _id : requestdata._id,
                price: requestdata.amount,
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
                        updateobj = {
                            status : "Failed",
                            error : paymentresponse.error
                        }
                    }else{
                        updateobj ={
                            status : "Success",
                            transactionrefno : paymentresponse.referenceno
                        }
                    }

                    ////Update Status
                    BroadbandRequest.findOneAndUpdate(
                        {_id : requestdata._id},
                        {$set : updateobj},
                        {new: true},
                        (err,paymentdet)=>{
                            if(err){
                                return res.status(404).json({
                                    error : "Error Occured while saving data"
                                })
                            }
                            if(paymentresponse.status === false){ //f///failed request
                                res.json({
                                    message :"Payment failed, if amount is debited from your account it will be rolled backed soon"
                                })
                            }else{ /////on success create broadband entry
                                //Adding details in Payment History Data
                                var objarr =[];
                                var date = new Date(new Date());  ///.toDateString() to chenge it from midnight
                                //PostPaid Functionality Remaining
                                var prepaidObj = new BroadbandPayHistory({
                                    "userId" : paymentdet.user,
                                    "productId" : paymentdet.broadband,
                                    "plantype" : paymentdet.plantype,
                                    "planfrom" : date,
                                    "plantill" : new Date(date.getTime()+(parseInt(paymentdet.planduration)*24*60*60*1000)),
                                    "referenceno" : paymentdet.transactionrefno,
                                    "paymentstatus": "Paid",
                                    "amount" : paymentdet.amount,
                                    "status" : "active",
                                    "isupgrade" : 0,
                                    "cardId" : paymentdet.cardId,
                                    "usage" :  paymentdet.plandata+"|"  ///75 total data  75|5 means 70GB Data remaining first day consumption 5
                                })
                                // objarr.push(prepaidObj);
                                
                                // objarr.forEach(element => {
                                    prepaidObj.save((err,result)=>{
                                        if(err){
                                            return res.status(404).json({
                                                error : err//"User Paid for scheme, Some Error occured in backoffice"
                                            })
                                        }
                                        res.json(paymentdet);
                                    })
                                // });
                                // res.json(paymentdet);
                            }
                        }
                    )
                })
                .catch((err)=>{
                    return res.status(404).json({
                        error : "Error Occured while Connecting to Payment GAteway server"
                    })
                })
        // res.json(data);
    })
}
/////////As We are making call from backend thats why commented
//Payment Gateway returned result 
// exports.broadbandplandpayment =(req,res)=>{
//     if(req.body.paymentstatus === false){
//         BroadbandRequest.findOneAndUpdate(
//             {_id : req.body._id},
//             {$set : {
//                 status : "Failed",
//                 error : req.body.error
//             }},
//             {new: true},
//             (err,paymentdet)=>{
//                 if(err){
//                     return res.status(404).json({
//                         error : "Payment failed"
//                     })
//                 }

//                 res.json({
//                     message :"Payment failed, if amount is debited from your account it will be rolled backed soon"
//                 })
//             }
//         )
//     }else{
//         BroadbandRequest.findOneAndUpdate(
//             {_id : req.body._id},
//             {$set : {
//                 status : "Success",
//                 transactionrefno : req.body.referenceno
//             }},
//             {new: true},
//             (err,paymentdet)=>{
//                 if(err){
//                     return res.status(404).json({
//                         error : "Failed to stored payment result"
//                     })
//                 }
                
//                 //Adding details in Payment History Data
//                 var objarr =[];
//                 var date = new Date(new Date().toDateString());
//                 //PostPaid Functionality Remaining
//                 var prepaidObj = new BroadbandPayHistory({
//                     "userId" : paymentdet.user,
//                     "productId" : paymentdet.broadband,
//                     "plantype" : paymentdet.plantype,
//                     "planfrom" : date,
//                     "plantill" : new Date(date.getTime()+(parseInt(paymentdet.planduration)*24*60*60*1000)),
//                     "referenceno" : paymentdet.transactionrefno,
//                     "paymentstatus": "Paid",
//                     "amount" : paymentdet.amount,
//                     "status" : "active",
//                     "isupgrade" : 0,
//                     "usage" :  paymentdet.plandata+"|"  ///75 total data  75|5 means 70GB Data remaining first day consumption 5
//                 })
//                 objarr.push(prepaidObj);
                
//                 objarr.forEach(element => {
//                     element.save((err,result)=>{
//                         if(err){
//                             return res.status(404).json({
//                                 message : "User Paid for scheme, Some Error occured in backoffice"
//                             })
//                         }
//                     })
//                 });
//                 res.json(paymentdet);
//         })
//     }
// }


//Broadband Upgrade or Renew

exports.BroadbandRenewalUpgradeRequest =(req,res)=>{
    //currentplan object will be of broadbandpayhistorytype
    var currentplan = req.body.currentplan;
    var newplan = req.body.newplan; //if Upgraded
    Broadband.find({_id : currentplan.productId}).exec((err,plans)=>{
        if(err || plans.length ==0){
            return res.status(404).json({
                error : "No Plan Found"
            })
        }
        var request = new BroadbandRequest({
            "user" : currentplan.userId,
            "broadband" : (newplan === undefined || newplan === null)? currentplan.productId :newplan._id,
            "existingplanId" : currentplan._id,
            "address" : req.body.address,
            "amount" : (newplan === undefined || newplan === null)?(plans[0].monthlyprice):newplan.monthlyprice,  ///if admin upgraded price afterwords then needs to be modified
            "plantype" : (newplan === undefined || newplan === null)? currentplan.plantype :newplan.plantype,
            "isupgrade" : (newplan === undefined || newplan === null)?0:1,
            "planduration" : (newplan === undefined || newplan === null)?plans[0].validity : newplan.validity,
            "plandata" : (newplan === undefined || newplan === null)?plans[0].data : newplan.data,
            "cardId" : req.paymentcard._id
        })
        request.save((err,requestdata)=>{
            if(err){
                return res.status(404).json({
                    error : "Buy broadband request failed"
                })
            }

            ////Payment Gateway Call for the 
            var fetchOption ={
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    _id : requestdata._id,
                    price: requestdata.amount,
                    cardnumber : req.paymentcard.cardnumber,
                    expirydate : req.paymentcard.expirydate,
                    cvv : req.body.cvv
                })
            }

            fetch(sysconfig.paymentgateway,fetchOption)
                .then(response=>response.json())
                .then(paymentresponse=>{
                    var updateobj;
                    if(paymentresponse.status === false){
                        updateobj = {
                            status : "Failed",
                            error : paymentresponse.error
                        }
                    }else{
                        updateobj ={
                            status : "Success",
                            transactionrefno : paymentresponse.referenceno
                        }
                    }
                    BroadbandRequest.findOneAndUpdate(
                        {_id : requestdata._id},
                        {$set : updateobj},
                        {new: true},
                        (err,paymentdet)=>{
                            if(err){
                                return res.status(404).json({
                                    error : "Error Occured while saving data"
                                })
                            }
                            if(paymentresponse.status === false){ /////failed request
                                res.json({
                                    message :"Payment failed, if amount is debited from your account it will be rolled backed soon"
                                })
                            }else{
                                BroadbandPayHistory.findById(paymentdet.existingplanId).exec((err,plans)=>{
                                    if(err){
                                        console.log(err)
                                    }
                                    var date;
                                    var updateobj;
                                    if(new Date(plans.plantill).getTime() < new Date(new Date().toDateString()).getTime()){
                                        //After Plan Expiry
                                        date = new Date(new Date()); ///.toDateString() to chenge it from midnight
                                        //handling closing active plans 
                                        updateobj = {
                                            status : "closed",
                                        }
                                    }else{
                                        //before plan expiry
                                        date = new Date(new Date(plans.plantill).getTime() + (1*24*60*60*1000));
                                        //added 1 day after plan ends
                                        updateobj = {
                                            isupgrade : 1,
                                        }
                                    }
                                    BroadbandPayHistory.findOneAndUpdate(
                                        {_id : paymentdet.existingplanId},
                                        {$set : updateobj},
                                        {new: true},
                                        (err,plans)=>{
                                            if(err){
                                                return res.status(404).json({
                                                    message : "User Paid for scheme, Some Error occured in backoffice"
                                                })
                                            }
                                        })
                
                
                                    var prepaidObj = new BroadbandPayHistory({
                                        "userId" : paymentdet.user,
                                        "productId" : paymentdet.broadband,
                                        "plantype" : paymentdet.plantype,
                                        "planfrom" : date,
                                        "plantill" : new Date(date.getTime()+(parseInt(paymentdet.planduration)*24*60*60*1000)),  //bydefault 30 days added
                                        "referenceno" : paymentdet.transactionrefno,
                                        "paymentstatus": "Paid",
                                        "amount" : paymentdet.amount,
                                        "status" : "active",
                                        "isupgrade" : 0,
                                        "cardId" : paymentdet.cardId,
                                        "usage" :  paymentdet.plandata+"|" 
                                    })
                                    prepaidObj.save((err,result)=>{
                                        if(err){
                                            console.log(err);
                                            return res.status(404).json({
                                                message : "User Paid for scheme, Some Error occured in backoffice"
                                            })
                                        }
                                        res.json(paymentdet);
                                    })
                                    // res.json(paymentdet);
                                })
                            }
                        })
                })
                .catch((err)=>{
                    return res.status(404).json({
                        error : "Error Occured while Connecting to Payment GAteway server"
                    })
                })
        })
    })
}

//Commented As we are calling the payment gateway from backend
//Returened from Payment Gateway
// exports.BroadbandPlanRenewalUpgrade =(req,res)=>{
//     //payment failed
//     if(req.body.paymentstatus === false){
//         BroadbandRequest.findOneAndUpdate(
//             {_id : req.body._id},
//             {$set : {
//                 status : "Failed",
//                 error : req.body.error
//             }},
//             {new: true},
//             (err,paymentdet)=>{
//                 if(err){
//                     return res.status(404).json({
//                         error : "Payment failed"
//                     })
//                 }
//                 res.json({
//                     message :"Payment failed, if amount is debited from your account it will be rolled backed soon"
//                 })
//             }
//         )
//     }else{
//         //payment success
//         BroadbandRequest.findOneAndUpdate(
//             {_id : req.body._id},
//             {$set : {
//                 status : "Success",
//                 transactionrefno : req.body.referenceno
//             }},
//             {new: true},
//             (err,paymentdet)=>{
//                 if(err){
//                     return res.status(404).json({
//                         error : "Failed to stored payment result"
//                     })
//                 }
//                 //get PaymentHistory details
//                 ///Check for Due date of existing plan first
//                 BroadbandPayHistory.findById(paymentdet.existingplanId).exec((err,plans)=>{
//                     var date;
//                     var updateobj;
//                     if(new Date(plans.plantill).getTime() < new Date(new Date().toDateString()).getTime()){
//                         //After Plan Expiry
//                         date = new Date(new Date().toDateString());
//                         //handling closing active plans
//                         updateobj = {
//                             status : "closed",
//                         }
//                     }else{
//                         //before plan expiry
//                         date = new Date(new Date(plans.plantill).getTime() + (1*24*60*60*1000));
//                         //added 1 day after plan ends
//                         updateobj = {
//                             isupgrade : 1,
//                         }
//                     }
//                     BroadbandPayHistory.findOneAndUpdate(
//                         {_id : paymentdet.existingplanId},
//                         {$set : updateobj},
//                         {new: true},
//                         (err,plans)=>{
//                             if(err){
//                                 return res.status(404).json({
//                                     message : "User Paid for scheme, Some Error occured in backoffice"
//                                 })
//                             }
//                         })


//                     var prepaidObj = new BroadbandPayHistory({
//                         "userId" : paymentdet.user,
//                         "productId" : paymentdet.broadband,
//                         "plantype" : paymentdet.plantype,
//                         "planfrom" : date,
//                         "plantill" : new Date(date.getTime()+(parseInt(paymentdet.planduration)*24*60*60*1000)),  //bydefault 30 days added
//                         "referenceno" : paymentdet.transactionrefno,
//                         "paymentstatus": "Paid",
//                         "amount" : paymentdet.amount,
//                         "status" : "active",
//                         "isupgrade" : 0,
//                         "usage" :  paymentdet.plandata+"|" 
//                     })
//                     prepaidObj.save((err,result)=>{
//                         if(err){
//                             console.log(err);
//                             return res.status(404).json({
//                                 message : "User Paid for scheme, Some Error occured in backoffice"
//                             })
//                         }
//                     })
//                     res.json(paymentdet);
//                 })
//             })
//         }
// }

//Get BroadBandCurrent plan


exports.getCurrentBroadbandPlan = (req,res)=>{
    BroadbandPayHistory.find({userId : req.profile._id, status: "active"}).exec((err,plans)=>{
        if(err){
            return res.status(404).json({
                error : "Error While getting current plan of user"
            })
        }
        res.json(plans);  ///2 Plans will be populated if renewed before expiry
    })
}


//Get Broadband payment success history
exports.getBroadbandPaymentHistory =(req,res)=>{
    BroadbandPayHistory.find({userId : req.profile._id}).exec((err,plans)=>{
        if(err){
            return res.status(404).json({
                error : "Error While getting current plan of user"
            })
        }
        res.json(plans);
    })
}
    

