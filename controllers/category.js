const Category = require("../models/category")

exports.getCategoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,categ)=>{
           if(err ||  !categ){
               return res.status(400).json({
                   error : "Category not present in database"
               })
           }
           req.category = categ;
           next();
        })    
}

exports.createCategory = (req,res) => {
    console.log(req.body)
    const category = new Category(req.body)
    
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                error : "Unable to save category to database"
            })
        }
        res.json({
            category});
    })

}

exports.getCategory = (req,res) => {
   return res.json(req.category)
}

exports.getAllCategories = (req,res) => {
    Category.find({}).exec((err,categories)=>{
        if(err){
            return res.status(400).json({
                error : "Unable to find categories in database"
            })
        }
         res.json(categories)
    })   
}


exports.updateCategory = (req,res) => {
    // req.category is getting populated from the middleware
    const category = req.category;
    category.name = req.body.name;

    category.save((err,updatedCategory)=>{
        if(err){
            return res.status(400).json({
                error : "Failed to update category in database"
            })
        }
        res.json(updatedCategory)
    })
}

exports.deleteCategory = (req,res) => {
    const category = req.category;

    category.remove((err,deletedCategory)=>{
        if(err){
            return res.status(400).json({
                error : "Unable to delete category in database"
            })
        }
        else if(!deletedCategory){
            return res.status(404).json({
                error : "No such category exists in database"
            })
        }
        res.json({
            message : `Successfully deleted ${deletedCategory.name}`
        })
    })
}
