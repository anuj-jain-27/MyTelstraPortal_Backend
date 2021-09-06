const express =require('express');
const mongoose= require( 'mongoose');
const broadbandLocSchema =  require( '../models/broadbandLocation');

exports.search=(req,res)=>{
  var searchterm=req.query.q
  console.log("search",searchterm)
      broadbandLocSchema.find({
        "$expr": {
            "$regexMatch": {
              "input": { "$concat": ["$suburb"," ","$city"," ","$state"] },
              "regex": searchterm,
              "options": "i"
            }
      }},(err,data)=>{
          if(err)
            return res.json("error: ",err.message)  
            res.json(data)
      });
}

