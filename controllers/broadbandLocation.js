const User = require("../models/user")
const Broadband = require("../models/broadband");
const BroadbandLocation = require("../models/broadbandLocation")


//get
exports.getBroadbandLocById = (req,res,next,id)=>{
    BroadbandLocation.findById(id).exec((err,plans)=>{
        if(err || !plans){
            return res.status(400).json({
                error : "No Broadband Plan available"
            })
        }
        req.broadbandloc = plans
        next()
    })
}



exports.getBroadbandLocations =(req,res)=>{
    BroadbandLocation.find({}).exec((err,locations)=>{
        if(err || !locations){
            return res.status(400).json({
                error : "No Broadband Location available"
            })
        }
        res.json(locations)
    })
}


//create
exports.addBroadBandLocation = (req,res)=>{
    var location = new BroadbandLocation(req.body)
    location.save((err,result)=>{
        if(err){
            return res.status(400).json({
                error : "Could Not Add Location"
            })
        }
        res.json(result);
    })
}


//Add Plan to Location
exports.addBroadBandPlanToLocation =(req,res,next)=>{
    var arr =[];
    
    req.body.plans.forEach(plan => {
        arr.push(plan._id);
    })
    BroadbandLocation.findOneAndUpdate(
        {_id : req.broadbandloc._id},
        {$push : {availableplans : arr}},
        {new: true},
        (err,location)=>{   
            if(err){
                return res.status(400).json({
                    error : "Error while adding plans"
                })
            }
            res.json(location);
        }
    )
}

//update
exports.updateBroadbandLocation = (req,res)=>{
    BroadbandLocation.findOneAndUpdate(
        {_id : req.broadbandloc._id},
        {$set : req.body},
        {new: true},
        (err,location) =>{
            if(err){
                return res.status(400).json({
                    error : "Error while updating location"
                })
            }
            res.json(location);
        }
    )
}

//delete

exports.removelocation= (req,res)=>{
    var id = req.broadbandloc._id;
    BroadbandLocation.findByIdAndRemove(
        id,
        (err,location)=>{
            if(err){
                return res.status(400).json({
                    error :"Error while deleting the broadband location"
                })
            }
            res.json({
                message : `Selected location deleted successfully`
            })
        }
    )
}