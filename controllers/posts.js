const PostMessage = require( '../models/postMessage');
//working
exports.getPostMessageById = (req,res,next,id)=>{
    PostMessage.findById(id).exec((err,post)=>{
           if(err ||  !post){
               return res.status(400).json({
                   error : "Plan not present in database"
               })
           }
           req.postmessage = post;
           next();
        })    
}
//working
exports.getPostMessage = (req,res) => {
    return res.json(req.postmessage)
 }
 //working
 exports.getAllPosts = (req,res) => {
     PostMessage.find({}).exec((err,posts)=>{
         if(err){
             return res.status(400).json({
                 error : "Unable to find plans in database"
             })
         }
          res.json(posts)
     })   
 }
//working
exports.createPost = (req,res) => {
    const { plan, validity, data, SMS, cost} = req.body;
    const newPostMessage = new PostMessage({ plan, validity, data, SMS, cost})
    newPostMessage.save((err,newpostmessage)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                error : "Unable to save plan to database"
            })}
        res.json({
            newpostmessage});
    })
}
// working
exports.updatePost = (req,res) => {
    const postmessage = req.postmessage;
    postmessage.plan = req.body.plan;
    postmessage.validity = req.body.validity;
    postmessage.data = req.body.data;
    postmessage.SMS = req.body.SMS;
    postmessage.cost= req.body.cost;
    postmessage.save((err,updatedPost)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                error : "Failed to update plan in database"
            })
        }
        res.json(updatedPost)
    })
}

//working
exports.deletePost = (req,res) => {
    const postmessage = req.postmessage;
    postmessage.remove((err,deletedPost)=>{
        if(err){
            return res.status(400).json({
                error : "Unable to delete plan in database"
            })
        }
        else if(!deletedPost){
            return res.status(404).json({
                error : "No such plan exists in database"
            })
        }
        res.json({
            message : `Successfully deleted ${deletedPost.plan}`
        })
    })
}
