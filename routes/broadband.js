var express = require('express')
var router = express.Router()
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {getBroadbandById,getBroadbandPlan,getAllBroadBandPlans,getBroadBandPlansByLocation,addBroadBand,updateBroadbandPlan,removeplan} = require("../controllers/broadband");
const {getUserById} = require("../controllers/user")
const {getBroadbandLocById} = require("../controllers/broadbandLocation")


router.param("userId",getUserById);
router.param("broadbandId",getBroadbandById);
router.param("broadbandLocId",getBroadbandLocById);

//routes
//get
router.get("/broadband",getAllBroadBandPlans);
router.get("/broadbandbylocation/:broadbandLocId",getBroadBandPlansByLocation);

router.get("/broadband/:broadbandId",getBroadbandPlan)

//Create
router.post("/addbroadband/:userId",isSignedIn,isAuthenticated,isAdmin,addBroadBand); //isSignedIn,isAuthenticated

//update
router.put("/updateBroadbandPlan/:broadbandId/:userId",isSignedIn,isAuthenticated,isAdmin,updateBroadbandPlan);//isSignedIn,isAuthenticated

//delete
router.delete("/deletebroadplan/:broadbandId/:userId",isSignedIn,isAuthenticated,isAdmin,removeplan) 

module.exports = router



