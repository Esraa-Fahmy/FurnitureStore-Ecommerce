

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const globalError = require('../important/globalError');
const createToken = require('../important/create.token');

exports.signup = asyncHandler(async (req, res, next) => {
  // Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //Generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
    
    const user = await User.findOne({ email: req.body.email });
  
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return next(new globalError('Incorrect email or password', 401));
    }
    //  generate token
    const token = createToken(user._id);
  
    // Delete password from response
    delete user._doc.password;
   
    res.status(200).json({ data: user, token });
  });


