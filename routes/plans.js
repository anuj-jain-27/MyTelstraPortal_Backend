////The Plans user subscribed to


const express = require('express');
const router = express.Router();
const {getPlanMessageById, getPlanMessage, getAllPlans, createPlan, createPlanNew} = require("../controllers/Plans")
const {getPostMessageById} = require("../controllers/posts")
const {getUserById} = require("../controllers/user")
const {getUserCardById} = require("../controllers/paymentcards")
const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth")

router.param("userId",getUserById)
router.param("planid",getPlanMessageById)
router.param("postid",getPostMessageById)
router.param("cardId",getUserCardById);

// router.post("/plan/create/",createPlan)
router.get("/plan/:planid",getPlanMessage)
router.get("/plans",getAllPlans)


router.post("/plan/create/:postid/:cardId/:userId",isSignedIn,isAuthenticated,createPlanNew) ///,isSignedIn,isAuthenticated



module.exports = router