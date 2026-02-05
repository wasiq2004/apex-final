import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const contactFormValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .withMessage('Invalid phone number'),
    body('interest')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Interest must be less than 200 characters'),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
];

export const careerApplicationValidation = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .withMessage('Invalid phone number'),
    body('position')
        .trim()
        .notEmpty().withMessage('Position is required')
        .isLength({ max: 200 }).withMessage('Position must be less than 200 characters'),
    body('resumeLink')
        .optional()
        .trim()
        .isURL().withMessage('Invalid URL format'),
    body('coverLetter')
        .optional()
        .trim()
        .isLength({ max: 5000 }).withMessage('Cover letter must be less than 5000 characters')
];

export const courseValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
    body('slug')
        .optional()
        .trim()
        .matches(/^[a-z0-9-]+$/).withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
    body('shortDescription')
        .trim()
        .notEmpty().withMessage('Short description is required')
        .isLength({ min: 10, max: 500 }).withMessage('Short description must be between 10 and 500 characters'),
    body('fullDescription')
        .trim()
        .notEmpty().withMessage('Full description is required')
        .isLength({ min: 50, max: 10000 }).withMessage('Full description must be between 50 and 10000 characters'),
    body('duration')
        .trim()
        .notEmpty().withMessage('Duration is required')
        .isLength({ max: 100 }).withMessage('Duration must be less than 100 characters'),
    body('mode')
        .optional()
        .isIn(['Online', 'Offline', 'Hybrid']).withMessage('Mode must be Online, Offline, or Hybrid'),
    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('thumbnail')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Thumbnail URL must be less than 500 characters'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
    body('rating')
        .optional()
        .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
    body('enrollments')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('Enrollments must be less than 50 characters'),
    body('modules')
        .optional()
        .isInt({ min: 0 }).withMessage('Modules must be a positive integer'),
    body('isBestSeller')
        .optional()
        .isBoolean().withMessage('isBestSeller must be a boolean'),
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean')
];

export const loginValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 100 }).withMessage('Username must be between 3 and 100 characters'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 3 }).withMessage('Password must be at least 3 characters')
];
