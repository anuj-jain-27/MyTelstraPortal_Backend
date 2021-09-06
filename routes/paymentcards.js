///Mobile Plan CRUD operations

const express = require('express');
const router = express.Router();
const {addUserCards, getAllUserCards, getUserCardById} = require("../controllers/paymentcards")
const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

router.param("userId",getUserById)

// router.get("/paymentcard/:userid",isSignedIn,isAuthenticated,getUserCardById)
// router.get("/cards",isSignedIn,isAuthenticated,isAdmin,getAllUserCards)
router.post("/paymentcard/create/:userId",isSignedIn,isAuthenticated,addUserCards)

module.exports = router


