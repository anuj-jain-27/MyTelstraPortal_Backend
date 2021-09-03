var express = require("express")
const { v4: uuidv4 } = require('uuid');
const cors = require("cors")
const fs = require('fs');

var app = express()
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(cors())

app.listen(8089,()=>{
    console.log("app started on 8089")
})

var array = [];

////////////Accept or Reject Payment Flag ////////////////////////
var acceptflag = true;
//////////////////////////////////////////////////////////////////


app.get("/",(req,res)=>{
    fs.readFile('paymentapilog.txt', 'utf8', function(err, data){
        // console.log(data);
        res.json(data)
    });
})

app.post("/paybroadband",(req,res)=>{
    var option
    if(acceptflag){
        option ={
            _id : req.body._id, 
            paymentstatus : true, 
            referenceno : uuidv4()
        }
    }else{
        option ={
            error : "Insufficient Bank balance",
            _id : req.body._id, 
            paymentstatus : false,
        }
    }
    var element = {
        "req":req.body,
        "res":option
    }
    array.push(element)
    fs.appendFile('paymentapilog.txt',new Date().toLocaleString() +" "+ JSON.stringify(element)+"\n", function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    res.send(option)
})

