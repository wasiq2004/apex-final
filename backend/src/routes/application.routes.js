import express from 'express';
import applicationService from '../services/application.service.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/applications
 * @desc    Submit an application (Internship or Mentor)
 * @access  Public
 */
router.post('/', async (req, res, next) => {
    try {
        const result = await applicationService.createApplication(req.body);
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/applications
 * @desc    Get applications (optionally filter by type)
 * @access  Private/Admin
 */
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const { type } = req.query; // ?type=internship or ?type=mentor
        const applications = await applicationService.getApplications(type);
        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PATCH /api/applications/:id/status
 * @desc    Update application status
 * @access  Private/Admin
 */
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await applicationService.updateStatus(req.params.id, status);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/applications/sheets
 * @desc    Get applications from Google Sheets (live data)
 * @access  Private/Admin
 */
router.get('/sheets', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const googleSheetsService = (await import('../services/googleSheets.service.js')).default;
        const applications = await googleSheetsService.getAllApplications();
        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        next(error);
    }
});

export default router;
