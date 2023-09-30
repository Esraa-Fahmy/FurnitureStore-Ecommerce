
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validator.middleware');

exports.getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];

exports.createCategoryValidator = [
    check('name')
    .notEmpty()
    .withMessage('Category Required')
    .isLength({ min: 3})
    .withMessage('short Category name')
    .isLength({ max: 32})
    .withMessage('long Category name'),
    validatorMiddleware,
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
  ];

  exports.deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];
