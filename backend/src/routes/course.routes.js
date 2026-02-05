import express from 'express';
import courseService from '../services/course.service.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { courseValidation, validateRequest } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/courses
 * @desc    Get all active courses (public)
 * @access  Public
 */
router.get('/', async (req, res, next) => {
    try {
        const courses = await courseService.getAllCourses(false);
        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/courses/best-selling
 * @desc    Get best-selling courses (max 3, active only)
 * @access  Public
 */
router.get('/best-selling', async (req, res, next) => {
    try {
        const courses = await courseService.getBestSellingCourses();
        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/courses/all
 * @desc    Get all courses including inactive (admin only)
 * @access  Private/Admin
 */
router.get('/all', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const courses = await courseService.getAllCourses(true);
        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/courses/category/:category
 * @desc    Get courses by category
 * @access  Public
 */
router.get('/category/:category', async (req, res, next) => {
    try {
        const courses = await courseService.getCoursesByCategory(req.params.category, false);
        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/courses/slug/:slug
 * @desc    Get course by slug
 * @access  Public
 */
router.get('/slug/:slug', async (req, res, next) => {
    try {
        const course = await courseService.getCourseBySlug(req.params.slug);

        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/courses/:id
 * @desc    Get course by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
    try {
        const course = await courseService.getCourseById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/courses
 * @desc    Create new course
 * @access  Private/Admin
 */
router.post('/', authenticateToken, requireAdmin, courseValidation, validateRequest, async (req, res, next) => {
    try {
        const course = await courseService.createCourse(req.body);
        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course
 * @access  Private/Admin
 */
router.put('/:id', authenticateToken, requireAdmin, courseValidation, validateRequest, async (req, res, next) => {
    try {
        const course = await courseService.updateCourse(req.params.id, req.body);

        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course
 * @access  Private/Admin
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        await courseService.deleteCourse(req.params.id);
        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PATCH /api/courses/:id/toggle-visibility
 * @desc    Toggle course visibility (active/inactive)
 * @access  Private/Admin
 */
router.patch('/:id/toggle-visibility', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const course = await courseService.toggleCourseVisibility(req.params.id);
        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
});

export default router;
