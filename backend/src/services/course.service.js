import { query } from '../database/connection.js';
import logger from '../config/logger.js';

/**
 * Generates a URL-friendly slug from a title
 */
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-');      // Replace multiple hyphens with single hyphen
};

class CourseService {
    /**
     * Get all courses (optionally filter by active status)
     */
    async getAllCourses(includeInactive = false) {
        try {
            const sql = includeInactive
                ? 'SELECT * FROM courses ORDER BY created_at DESC'
                : 'SELECT * FROM courses WHERE is_active = TRUE ORDER BY created_at DESC';

            const courses = await query(sql);
            return courses;
        } catch (error) {
            logger.error('Error fetching courses:', error);
            throw error;
        }
    }

    /**
     * Get course by ID
     */
    async getCourseById(id) {
        try {
            const sql = 'SELECT * FROM courses WHERE id = ?';
            const courses = await query(sql, [id]);
            return courses[0] || null;
        } catch (error) {
            logger.error('Error fetching course by ID:', error);
            throw error;
        }
    }

    /**
     * Get course by slug
     */
    async getCourseBySlug(slug) {
        try {
            const sql = 'SELECT * FROM courses WHERE slug = ?';
            const courses = await query(sql, [slug]);
            return courses[0] || null;
        } catch (error) {
            logger.error('Error fetching course by slug:', error);
            throw error;
        }
    }

    /**
     * Get best-selling courses (max 3, active only)
     */
    async getBestSellingCourses() {
        try {
            const sql = `
                SELECT * FROM courses 
                WHERE is_best_seller = TRUE AND is_active = TRUE 
                ORDER BY created_at DESC 
                LIMIT 3
            `;
            const courses = await query(sql);
            return courses;
        } catch (error) {
            logger.error('Error fetching best-selling courses:', error);
            throw error;
        }
    }

    /**
     * Create a new course
     */
    async createCourse(courseData) {
        try {
            const {
                title,
                slug: customSlug,
                shortDescription,
                fullDescription,
                duration,
                mode = 'Online',
                price,
                thumbnail,
                category,
                rating = 0.0,
                enrollments = '0',
                modules = 0,
                isBestSeller = false,
                isActive = true
            } = courseData;

            // Generate slug from title if not provided
            const slug = customSlug || generateSlug(title);

            // Check if slug already exists
            const existing = await this.getCourseBySlug(slug);
            if (existing) {
                throw new Error(`Course with slug "${slug}" already exists`);
            }

            const sql = `
                INSERT INTO courses (
                    title, slug, short_description, full_description, 
                    duration, mode, price, thumbnail, category, 
                    rating, enrollments, modules, is_best_seller, is_active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await query(sql, [
                title,
                slug,
                shortDescription,
                fullDescription,
                duration,
                mode,
                price || null,
                thumbnail || null,
                category,
                rating,
                enrollments,
                modules,
                isBestSeller,
                isActive
            ]);

            logger.info(`✅ Course created with ID: ${result.insertId}`);
            return await this.getCourseById(result.insertId);
        } catch (error) {
            logger.error('Error creating course:', error);
            throw error;
        }
    }

    /**
     * Update an existing course
     */
    async updateCourse(id, courseData) {
        try {
            const {
                title,
                slug: customSlug,
                shortDescription,
                fullDescription,
                duration,
                mode,
                price,
                thumbnail,
                category,
                rating,
                enrollments,
                modules,
                isBestSeller,
                isActive
            } = courseData;

            // Generate slug from title if not provided
            const slug = customSlug || generateSlug(title);

            // Check if slug is taken by another course
            const existing = await this.getCourseBySlug(slug);
            if (existing && existing.id !== parseInt(id)) {
                throw new Error(`Course with slug "${slug}" already exists`);
            }

            const sql = `
                UPDATE courses
                SET 
                    title = ?, 
                    slug = ?, 
                    short_description = ?, 
                    full_description = ?,
                    duration = ?, 
                    mode = ?, 
                    price = ?, 
                    thumbnail = ?, 
                    category = ?,
                    rating = ?, 
                    enrollments = ?, 
                    modules = ?, 
                    is_best_seller = ?, 
                    is_active = ?
                WHERE id = ?
            `;

            await query(sql, [
                title,
                slug,
                shortDescription,
                fullDescription,
                duration,
                mode,
                price || null,
                thumbnail || null,
                category,
                rating,
                enrollments,
                modules,
                isBestSeller,
                isActive,
                id
            ]);

            logger.info(`✅ Course updated: ${id}`);
            return await this.getCourseById(id);
        } catch (error) {
            logger.error('Error updating course:', error);
            throw error;
        }
    }

    /**
     * Delete a course
     */
    async deleteCourse(id) {
        try {
            const sql = 'DELETE FROM courses WHERE id = ?';
            await query(sql, [id]);

            logger.info(`✅ Course deleted: ${id}`);
            return { success: true };
        } catch (error) {
            logger.error('Error deleting course:', error);
            throw error;
        }
    }

    /**
     * Toggle course active/inactive status
     */
    async toggleCourseVisibility(id) {
        try {
            const course = await this.getCourseById(id);
            if (!course) {
                throw new Error('Course not found');
            }

            const newStatus = !course.is_active;
            const sql = 'UPDATE courses SET is_active = ? WHERE id = ?';
            await query(sql, [newStatus, id]);

            logger.info(`✅ Course visibility toggled: ${id} -> ${newStatus ? 'active' : 'inactive'}`);
            return await this.getCourseById(id);
        } catch (error) {
            logger.error('Error toggling course visibility:', error);
            throw error;
        }
    }

    /**
     * Get courses by category
     */
    async getCoursesByCategory(category, includeInactive = false) {
        try {
            const sql = includeInactive
                ? 'SELECT * FROM courses WHERE category = ? ORDER BY created_at DESC'
                : 'SELECT * FROM courses WHERE category = ? AND is_active = TRUE ORDER BY created_at DESC';

            const courses = await query(sql, [category]);
            return courses;
        } catch (error) {
            logger.error('Error fetching courses by category:', error);
            throw error;
        }
    }
}

export default new CourseService();
