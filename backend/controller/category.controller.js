const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const globalError = require('../important/globalError');
const Category = require('../models/category.model');

exports.getCategories = asyncHandler (async(req, res) => {
    const categories = await Category.find({});
   res.status(200).json({ results: categories.length, data: categories});

  });


  exports.getCategory = asyncHandler(async(req, res, next) => {
 const { id } = req.params;
 const category = await Category.findById(id);
 if (!category) {
   return next(new globalError (`No category for this id`, 404))
 }
 res.status(200).json({data: category});
  });


  exports.createCategory = asyncHandler (async(req, res) => {
    const name = req.body.name;
   
    const category = await Category.create({name, slug: slugify(name) });
    res.status(201).json({data: category });
  });


  exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
        {_id: id },
        { name, slug: slugify(name) },
        {new: true}
    );
        if (!category) {
         return next(new globalError (`No category for this id`, 404))
        }
        res.status(200).json({data: category});
  });


     exports.deleteCategory = asyncHandler(async (req, res, next) => {
     const { id } = req.params;
     const category = await Category.findByIdAndDelete(id);
    

     if (!category) {
      return next(new globalError (`No category for this id`, 404))
     }
     res.status(204).send();

     });

     