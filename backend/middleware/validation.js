import { body, validationResult } from 'express-validator';

// Validation middleware to check for errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
export const registerValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// User login validation
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Resume validation
export const resumeValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Resume title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters')
];

// Project validation
export const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Project title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Project description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid date format')
];

// Course validation
export const courseValidation = [
  body('courseName')
    .trim()
    .notEmpty().withMessage('Course name is required')
    .isLength({ max: 200 }).withMessage('Course name cannot exceed 200 characters'),
  body('institution')
    .trim()
    .notEmpty().withMessage('Institution is required'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid date format')
];

// Achievement validation
export const achievementValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Achievement title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format')
];

// Skill validation
export const skillValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Skill name is required')
    .isLength({ max: 100 }).withMessage('Skill name cannot exceed 100 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn([
      'programming-languages',
      'frameworks-libraries',
      'databases',
      'tools-platforms',
      'soft-skills',
      'languages',
      'design',
      'other'
    ]).withMessage('Invalid category')
];
