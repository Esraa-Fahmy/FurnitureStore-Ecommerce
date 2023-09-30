const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const Product = require('../models/product.model');
const { uploadMixOfImages } = require('../middleware/uploadImage.middleware');

exports.uploadProductImages = uploadMixOfImages([
   {
     name: 'imageCover',
     maxCount: 1,
   },
   {
     name: 'images',
     maxCount: 5,
   },
 ]);
 
 exports.resizeProductImages = asyncHandler(async (req, res, next) => {
   
   if (req.files.imageCover) {
     const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
 
     await sharp(req.files.imageCover[0].buffer)
       .resize(2000, 1333)
       .toFormat('jpeg')
       .jpeg({ quality: 95 })
       .toFile(`uploads/products/${imageCoverFileName}`);
 
     // Save image into our db
     req.body.imageCover = imageCoverFileName;
   }
   //2- Image processing for images
   if (req.files.images) {
     req.body.images = [];
     await Promise.all(
       req.files.images.map(async (img, index) => {
         const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
 
         await sharp(img.buffer)
           .resize(2000, 1333)
           .toFormat('jpeg')
           .jpeg({ quality: 95 })
           .toFile(`uploads/products/${imageName}`);
 
         // Save image into our db
         req.body.images.push(imageName);
       })
     );
 
     next();
   }
 });
 

exports.getProducts = asyncHandler (async(req,res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    const products = await Product.find({})
    .skip(skip).limit(limit).populate({path: 'category', select: 'name -_id'});
    res.status(200).json({ results: products.length, page, data: products});
  });

  exports.getProduct = asyncHandler(async(req,res) => {
 const { id } = req.params;
 const product = await Product.findById(id).populate({path: 'category', select: 'name -_id'});
 if (!product) {
    res.status(404).json({ msg:`No product for this id ${id}`});
 }
 res.status(200).json({data: product});
  });


  exports.createProduct = asyncHandler (async(req, res) => {
    req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);
    res.status(201).json({data: product });
  });


  exports.updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.findByIdAndUpdate(
        { _id: id },
        req.body,
        {new: true,}
    );
        if (!product) {
           res.status(404).json({ msg:`No product for this id ${id}`});
        }
        res.status(200).json({data: product});
  });


     exports.deleteProduct = asyncHandler(async (req,res) => {
     const { id } = req.params;
     const product = await Product.findByIdAndDelete(id);
    

     if (!product) {
        res.status(404).json({ msg:`No product for this id ${id}`});
     }
     res.status(204).send();

     });

