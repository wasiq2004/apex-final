import express from 'express';
import authService from '../services/auth.service.js';
import { loginValidation, validateRequest } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/login', loginValidation, validateRequest, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/verify
 * @desc    Verify JWT token
 * @access  Public
 */
router.post('/verify', async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token required' });
        }

        const decoded = authService.verifyToken(token);

        res.json({
            success: true,
            data: { valid: true, user: decoded }
        });
    } catch (error) {
        res.json({
            success: false,
            data: { valid: false }
        });
    }
});

export default router;
