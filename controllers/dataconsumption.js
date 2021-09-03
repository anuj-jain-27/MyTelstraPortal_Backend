
const dataconsumption = require( '../models/dataconsumption');
//working
exports.getDataConsumptionById = (req,res,next,id)=>{
    dataconsumption.findById(id).exec((err,data)=>{
           if(err ||  !data){
               return res.status(400).json({
                   error : "Data not present in database"
               })
           }
           req.datamessage = data;
           next();
        })    
}
//working
exports.getData = (req,res) => {
    return res.json(req.datamessage)
 }

//working
exports.getAllDatas = (req,res) => {
    dataconsumption.find().exec((err,datas)=>{
        if(err){
            return res.status(400).json({
                error : "Unable to find data in database"
            })
        }
        return res.json(datas)
    })   
}
//working
exports.createData = (req,res) => {
    const { day, dc} = req.body;
    const newDataConsumption = new dataconsumption({ day, dc})
    newDataConsumption.save((err,newdataconsumption)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                error : "Unable to save plan to database"
            })}
        res.json({
            newdataconsumption});
    })
}