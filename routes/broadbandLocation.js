var express = require('express')
var router = express.Router()
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {getBroadbandLocById,getBroadbandLocations,addBroadBandLocation,addBroadBandPlanToLocation,updateBroadbandLocation,removelocation} = require("../controllers/broadbandLocation")
const {getUserById} = require("../controllers/user")


router.param("userId",getUserById);
router.param("broadbandLocId",getBroadbandLocById);


//get
router.get("/broadbandlocation",getBroadbandLocations)

//Create
router.post("/addBroadBandLocation/:userId",isSignedIn,isAuthenticated,isAdmin,addBroadBandLocation); //

//ops
router.post("/addplantolocation/:broadbandLocId/:userId",isSignedIn,isAuthenticated,isAdmin,addBroadBandPlanToLocation); //isSignedIn,isAuthenticated,

//update
router.put("/updatebroadlocation/:broadbandLocId/:userId",isSignedIn,isAuthenticated,isAdmin,updateBroadbandLocation);

//delete
router.delete("/deletebroadlocation/:broadbandLocId/:userId",isSignedIn,isAuthenticated,isAdmin,removelocation);


module.exports = router