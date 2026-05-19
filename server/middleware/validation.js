const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  };
};

// User validation rules
const userValidation = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .matches(/@chitkara\.edu\.in$/)
      .withMessage('Must be a valid Chitkara University email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('city')
      .optional()
      .isIn(['Chandigarh', 'Baddi', 'Rajpura', 'Solan'])
      .withMessage('Invalid city'),
    body('phone')
      .optional()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Invalid Indian phone number'),
  ],
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('city')
      .optional()
      .isIn(['Chandigarh', 'Baddi', 'Rajpura', 'Solan'])
      .withMessage('Invalid city'),
    body('phone')
      .optional()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Invalid Indian phone number'),
  ],
  adminUpdate: [
    body('role')
      .optional()
      .isIn(['student', 'moderator', 'admin'])
      .withMessage('Invalid role'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be true or false'),
    body('isVerified')
      .optional()
      .isBoolean()
      .withMessage('isVerified must be true or false'),
  ],
};

// Listing validation rules
const listingValidation = {
  create: [
    body('categoryId')
      .notEmpty()
      .withMessage('Category is required'),
    body('title')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0, max: 1000000 })
      .withMessage('Price must be between 0 and 1,000,000'),
    body('city')
      .notEmpty()
      .isIn(['Chandigarh', 'Baddi', 'Rajpura', 'Solan'])
      .withMessage('Valid city is required'),
    body('condition')
      .optional()
      .isIn(['Like New', 'Excellent', 'Good', 'Fair', 'Poor'])
      .withMessage('Invalid condition'),
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0, max: 1000000 })
      .withMessage('Price must be between 0 and 1,000,000'),
    body('condition')
      .optional()
      .isIn(['Like New', 'Excellent', 'Good', 'Fair', 'Poor'])
      .withMessage('Invalid condition'),
    body('city')
      .optional()
      .isIn(['Chandigarh', 'Baddi', 'Rajpura', 'Solan'])
      .withMessage('Invalid city'),
    body('status')
      .optional()
      .isIn(['active', 'pending', 'sold', 'inactive'])
      .withMessage('Invalid status'),
    body('isApproved')
      .optional()
      .isBoolean()
      .withMessage('isApproved must be true or false'),
  ],
};

module.exports = {
  validate,
  userValidation,
  listingValidation,
};
