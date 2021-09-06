const express = require('express');
const router = express.Router();

const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth")
const {getAllDatas, getDataConsumptionById, getData, createData} = require("../controllers/dataconsumption")

router.param("dataid",getDataConsumptionById);
router.get("/data/:dataid",getData);
router.get("/datas",getAllDatas);
router.post("/data/create",createData)
module.exports = router





