const app = require("./index")
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/MyTelstraPortalDB', {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=>{
    console.log("DATABASE CONNECTED");
        app.listen(8000,()=>{
            console.log("Server started")
        })
    })
    .catch((err)=>{
        console.log(err)
        console.log("Database Connection failed")
    })