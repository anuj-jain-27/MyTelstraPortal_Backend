const Product = require("../models/product")
const User=require("../models/user")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")


exports.getProductById = (req,res,next,id)=>{
  
    Product.findById(id).populate("category").exec((err,product)=>{
        if(err){
            res.status(400).json({
                error : "Product not found in database"
            })
        }
        req.product = product;
        next();
    })
    
}

exports.createProduct = (req,res)=>{
    //console.log(req);
    console.log("create product")
    let form  = new formidable.IncomingForm();
    form.keepExtensions = true;
    console.log("form: ",form)
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error : "A problem occurred with the image"
            })
        }
         
       const {name,description,price,stock,category} = fields;
       console.log("form fields: ",fields)
       if(!name || !description || !price || !stock){
           return res.status(400).json({
               error : "Please include all fields"
           })
       }

        let product = new Product(fields)

        // File handling
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "File size is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        console.log(product.name);  
        // Saving Image to Database 
        product.save((err,product)=>{
            if(err){
                console.log(err)
                res.status(400).json({
                    error: "Unable to save product to database"
                })
            }
            res.json(product)      
        })
        
    })
}

exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

// MIDDLEWARE
exports.photo = (req,res,next) =>{
    if(req.product.photo.data){
        //res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo)
    }
    next();
}


exports.updateProduct = (req,res) => {
    console.log("inside updateProduct controller")
    let form  = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error : "A problem occurred with the image"
            })
        }

        let product = req.product;
        product  = _.extend(product,fields)

        // File handling
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "File size is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        console.log(product);  
        // Saving Image to Database 
        product.save((err,product)=>{
            if(err){
                console.log(err)
                res.status(400).json({
                    error: "Updation of product to database failed"
                })
            }
            res.json(product)      
        })
        
    })
    
}

exports.deleteProduct = (req,res) => {
   let product = req.product;
   product.remove((err,deletedProduct)=>{
       if(err){
           return res.status(400).json({
               error : "Unable to delete product from database"
           })
       }
      return res.json({
          message : `Selected product ${deletedProduct.name} deleted successfully` 
      })
   })
}

// Listing of products
exports.getAllProducts = (req,res) => {
   let maxPhotos = req.query.limit ? parseInt(req.query.limit): 10
   let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product.find({})
    .populate("category")
    .limit(maxPhotos)
    .sort([[sortBy,"asc"]])
    .exec((err,productList)=>{
        if(err){
            return res.status(400).json({
                error : "No products in database"
            })
        }

        res.json(productList)
    })

}

exports.getCategories = (req,res) => {
    Product.distinct("category",{},(err,categories)=>{
        if(err){
            return res.json({
                error : "No categories found in database"
            })
        }
        res.json(categories)
    })
}

exports.searchProduct=(req,res)=>{
    var searchterm=req.query.q
    console.log("search",searchterm)
    Product.find({
          "$expr": {
              "$regexMatch": {
                "input": { "$concat": ["$name"," ","$description"] },
                "regex": searchterm,
                "options": "i"
              }
        }},(err,data)=>{
            if(err)
              return res.json("error: ",err.message)  
              res.json(data)
              //console.log(data)
        });
        console.log("searchend")
}

exports.addproducttocart=(req,res)=>{
    if(!req.profile._id)
    {
        res.status(400).json({error:"User not Authenticated, Sign in first"})
    }
    User.findByIdAndUpdate(
        req.profile._id,
        {$push: {"cart": req.body}},
        {new : true},
        function(err, model) {
            if(err){
                res.status(400).json({
                    error:"unable to add product to the cart"
                })
            }
            User.findById(req.profile._id).populate("cart.product").exec((err,doc)=>{
                if(err){
                     return res.status(400).json({
                         error : "No products present in cart"
                     })
                }
                res.json(doc.cart)
            })
        }
    )
}
exports.getproductsincart = (req,res) => {

    User.findById(req.profile._id).populate("cart.product").exec((err,doc)=>{
        if(err){
             return res.status(400).json({
                 error : "No products present in cart"
             })
        }
    //    console.log(doc.cart)
        res.json(doc.cart)
    })
}
exports.deleteproductfromcart=(req,res)=>{
    if(!req.profile._id)
        res.status(400).json({error:"User not Authenticated, Sign in first"})
    console.log(req.body)
    User.findById(req.profile._id,(err, doc)=>{
            if(err){
                res.status(400).json({error:"unable to find the user" })
            }
            var idx =-1;
            doc.cart.forEach((data,index)=>{
                if(data?.product==req.body.id)
                  {
                      idx=index
                      return
                  }
            })
           // console.log(doc.cart)
            console.log(idx)
            
            if (idx != -1) {
                doc.cart.splice(idx, 1);
                console.log("delete controller:",doc)
                doc.save(function(error) {
                    if (error) {
                        console.log(error);
                        res.status(400).json({error:"unable to save the changes"})
                    } else 
                        res.status(200).json(doc);
                })
                return;
            }
            res.status(404).json({error:"error occoured"});
        })
    }
 
exports.emptycart = (req,res) => {
    if(!req.profile._id)
    res.status(400).json({error:"User not Authenticated, Sign in first"})
    
    User.findById(req.profile._id,(err, doc)=>{
        if(err){
            res.status(400).json({error:"unable to find the user" })
        }
        doc.cart=[]
        doc.save(function(error) {
            if (error) 
                res.status(400).json({error:"unable to save the changes"})
            else 
               res.status(200).json(doc.cart);
            })
    })      
}
exports.updateproductoncart=(req,res)=>{
    if(!req.profile._id)
       res.status(400).json({error:"User not Authenticated, Sign in first"})

    User.findById(req.profile._id,(err, doc)=>{
        if(err){
            res.status(400).json({error:"unable to find the user" })
        }
        doc.cart.every((data,index)=>{
            if(data.product==req.body.id)
              {
                  doc.cart[index].quantity=req.body.quantity  
                  return false
              }
              return true
        })
        doc.save(function(error) {
            if (error) {
            //        console.log(error);
                    res.status(400).json({error:"unable to save the changes"})
                } else 
                    res.status(200).json(doc);
            })
    })
}
// MIDDLEWARE for frontend
// TODO : Not included in routes for product as of now
exports.updateStockAndSold = (req,res,next) =>{

    let myOps = req.body.order.products.map(prod => {

        return {
            updateOne : {
                filter : {_id : prod._id},
                update : {$inc : {stock : -prod.count,sold : +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOps,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                err : "Unable to update stock and sold property"
            })
        }
        next();
    })
}