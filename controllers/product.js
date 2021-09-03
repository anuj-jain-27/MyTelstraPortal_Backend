const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")


exports.getProductById = (req,res,next,id)=>{
  
    Product.findById(id).populate("category").exec((err,product)=>{
        if(err){
            res.satus(400).json({
                error : "Product not found in database"
            })
        }
        req.product = product;
        next();
    })
    
}

exports.createProduct = (req,res)=>{
    let form  = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error : "A problem occurred with the image"
            })
        }
         
       const {name,description,price,category,stock} = fields;
       
       if(!name || !description || !price || !category || !stock){
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
        console.log(product);  
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
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}


exports.updateProduct = (req,res) => {

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
    .select("-photo")
    .populate("category")
    .limit(maxPhotos)
    .sort([[sortBy,"asc"]])
    .exec((err,productList)=>{
        if(err){
            return res.status(400).json({
                error : "No products in database"
            })
        }

        res.json(products)
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




