import express from 'express';
import internshipService from '../services/internship.service.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/internships
 * @desc    Get all active internships (public)
 * @access  Public
 */
router.get('/', async (req, res, next) => {
    try {
        const internships = await internshipService.getAllInternships(false);
        res.json({
            success: true,
            data: internships
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/internships/all
 * @desc    Get all internships including inactive (admin only)
 * @access  Private/Admin
 */
router.get('/all', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const internships = await internshipService.getAllInternships(true);
        res.json({
            success: true,
            data: internships
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/internships/:id
 * @desc    Get internship by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
    try {
        const internship = await internshipService.getInternshipById(req.params.id);
        if (!internship) {
            return res.status(404).json({
                success: false,
                error: 'Internship not found'
            });
        }
        res.json({
            success: true,
            data: internship
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/internships
 * @desc    Create new internship
 * @access  Private/Admin
 */
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const internship = await internshipService.createInternship(req.body);
        res.status(201).json({
            success: true,
            data: internship
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/internships/:id
 * @desc    Update internship
 * @access  Private/Admin
 */
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const internship = await internshipService.updateInternship(req.params.id, req.body);
        res.json({
            success: true,
            data: internship
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/internships/:id
 * @desc    Delete internship
 * @access  Private/Admin
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        await internshipService.deleteInternship(req.params.id);
        res.json({
            success: true,
            message: 'Internship deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

export default router;
