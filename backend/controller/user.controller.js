const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const globalError = require('../important/globalError');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { uploadSingleImage } = require('../middleware/uploadImage.middleware');

exports.uploadUserImage = uploadSingleImage('profileImg');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();

 });

 
exports.getUsers = asyncHandler (async(req, res) => {
    const users = await User.find({});
   res.status(200).json({ results: users.length, data: users});

  });


  exports.getUser = asyncHandler(async(req, res, next) => {
 const { id } = req.params;
 const user = await User.findById(id);
 if (!user) {
   return next(new globalError (`No user for this id`, 404))
 }
 res.status(200).json({data: user});
  });


  exports.createUser= asyncHandler (async(req, res) => {
   
    const user = await User.create({...req.body});
    res.status(201).json({data: user });
  });


  exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
           name: req.body.name,
           slug: req.body.slug,
           phone: req.body.phone,
           email: req.body.email,
           profileImg: req.body.profileImg,
           role: req.body.role

        },
        {new: true}
    );
        if (!user) {
         return next(new globalError (`No user for this id`, 404))
        }
        res.status(200).json({data: user});
  });

  exports.changeUserPassword = asyncHandler(async (req, res, next) => {
   const user = await User.findByIdAndUpdate(
      req.params.id,
      {
         password: await bcrypt.hash(req.body.password, 12),
      },
      {
         new: true,
      }
   );
   if (!user) {
      return next(new globalError (`No user for this id`, 404))
     }
     res.status(200).json({data: user});
   });


     exports.deleteUser = asyncHandler(async (req, res, next) => {
     const { id } = req.params;
     const user = await User.findByIdAndDelete(id);
    

     if (!user) {
      return next(new globalError (`No user for this id`, 404))
     }
     res.status(204).send();

     });

     