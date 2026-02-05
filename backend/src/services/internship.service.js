import { query } from '../database/connection.js';
import logger from '../config/logger.js';

class InternshipService {
    async getAllInternships(includeInactive = false) {
        try {
            let sql = 'SELECT * FROM internships';
            if (!includeInactive) {
                sql += ' WHERE is_active = TRUE';
            }
            sql += ' ORDER BY created_at DESC';
            return await query(sql);
        } catch (error) {
            logger.error('Error fetching internships:', error);
            throw error;
        }
    }

    async getInternshipById(id) {
        try {
            const sql = 'SELECT * FROM internships WHERE id = ?';
            const results = await query(sql, [id]);
            return results[0];
        } catch (error) {
            logger.error(`Error fetching internship ${id}:`, error);
            throw error;
        }
    }

    async createInternship(data) {
        try {
            const sql = `
                INSERT INTO internships 
                (title, description, location, duration, stipend, is_active) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const params = [
                data.title,
                data.description,
                data.location || 'Remote',
                data.duration,
                data.stipend,
                data.isActive !== undefined ? data.isActive : true
            ];

            const result = await query(sql, params);
            return { id: result.insertId, ...data };
        } catch (error) {
            logger.error('Error creating internship:', error);
            throw error;
        }
    }

    async updateInternship(id, data) {
        try {
            const sql = `
                UPDATE internships 
                SET title = ?, description = ?, location = ?, duration = ?, stipend = ?, is_active = ?
                WHERE id = ?
            `;
            const params = [
                data.title,
                data.description,
                data.location,
                data.duration,
                data.stipend,
                data.isActive,
                id
            ];

            await query(sql, params);
            return { id, ...data };
        } catch (error) {
            logger.error(`Error updating internship ${id}:`, error);
            throw error;
        }
    }

    async deleteInternship(id) {
        try {
            const sql = 'DELETE FROM internships WHERE id = ?';
            await query(sql, [id]);
            return { id };
        } catch (error) {
            logger.error(`Error deleting internship ${id}:`, error);
            throw error;
        }
    }
}

export default new InternshipService();
