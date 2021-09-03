var express = require('express')
var router = express.Router()
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {buynewbroadband,broadbandplandpayment,BroadbandRenewalUpgradeRequest,BroadbandPlanRenewalUpgrade} = require("../controllers/broadbandops")
const {getBroadbandById} = require("../controllers/broadband")
const {getUserById} = require("../controllers/user")
const {getUserCardById} = require("../controllers/paymentcards")


router.param("userId",getUserById);
router.param("broadbandId",getBroadbandById);
router.param("cardId",getUserCardById);

//Routes
router.post("/buynewbroadband/:broadbandId/:cardId/:userId",isSignedIn,isAuthenticated,buynewbroadband) ///,isSignedIn,isAuthenticated

// router.post("/buypaymentresponce/:userId",broadbandplandpayment) ///isSignedIn,isAuthenticated,

router.post("/renewupgradebroadband/:cardId/:userId",isSignedIn,isAuthenticated,BroadbandRenewalUpgradeRequest) ///,isSignedIn,isAuthenticated

// router.post("/renewpaymentresponse/:userId",BroadbandPlanRenewalUpgrade) ///,isSignedIn,isAuthenticated


module.exports = router
