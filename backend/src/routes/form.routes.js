import express from 'express';
import googleSheetsService from '../services/googleSheets.service.js';
import { contactFormValidation, careerApplicationValidation, validateRequest } from '../middleware/validation.middleware.js';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * @route   POST /api/forms/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post('/contact', contactFormValidation, validateRequest, async (req, res, next) => {
    try {
        const { name, email, phone, interest, message } = req.body;

        await googleSheetsService.submitContactForm({
            name,
            email,
            phone,
            interest,
            message
        });

        logger.info(`✅ Contact form submitted: ${email}`);

        res.json({
            success: true,
            message: 'Contact form submitted successfully'
        });
    } catch (error) {
        logger.error('Contact form submission failed:', error);
        next(error);
    }
});

/**
 * @route   POST /api/forms/career
 * @desc    Submit career application
 * @access  Public
 */
router.post('/career', careerApplicationValidation, validateRequest, async (req, res, next) => {
    try {
        const { fullName, email, phone, position, resumeLink, coverLetter } = req.body;

        await googleSheetsService.submitCareerApplication({
            fullName,
            email,
            phone,
            position,
            resumeLink,
            coverLetter
        });

        logger.info(`✅ Career application submitted: ${email} for ${position}`);

        res.json({
            success: true,
            message: 'Career application submitted successfully'
        });
    } catch (error) {
        logger.error('Career application submission failed:', error);
        next(error);
    }
});

export default router;
