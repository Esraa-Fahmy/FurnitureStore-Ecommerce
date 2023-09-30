const express = require('express');
const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
   
  } = require('../important/validators/user.validator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword
} = require('../controller/user.controller');

const router = express.Router();
router.put('/changePassword/:id', changeUserPassword);

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage,  updateUserValidator,  updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;

