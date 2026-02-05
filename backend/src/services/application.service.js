import { query } from '../database/connection.js';
import googleSheetsService from './googleSheets.service.js';
import logger from '../config/logger.js';

class ApplicationService {
    async createApplication(data) {
        try {
            // Save to Database
            const sql = `
                INSERT INTO applications 
                (type, internship_id, full_name, email, phone, resume_link, message, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
            `;
            const params = [
                data.type, // 'internship' or 'mentor'
                data.internshipId || null,
                data.fullName,
                data.email,
                data.phone,
                data.resumeLink,
                data.message || data.coverLetter || ''
            ];

            const result = await query(sql, params);

            // Log success for DB
            logger.info(`✅ Application saved to DB: ${data.email} (${data.type})`);

            // Save to Google Sheets (Fire and forget or await?)
            // We should await to ensure it works, or at least try-catch to not block DB success.
            try {
                if (data.type === 'internship') {
                    // Fetch internship title for sheet
                    let internshipTitle = 'General Application';
                    if (data.internshipId) {
                        const [internship] = await query('SELECT title FROM internships WHERE id = ?', [data.internshipId]);
                        if (internship) internshipTitle = internship.title;
                    }

                    await googleSheetsService.submitInternshipApplication({
                        ...data,
                        internshipTitle
                    });
                } else if (data.type === 'mentor') {
                    await googleSheetsService.submitMentorApplication(data);
                }
            } catch (sheetError) {
                logger.error('Failed to save to Google Sheet, but DB saved:', sheetError);
                // Don't throw logic - application is safe in DB.
            }

            return { id: result.insertId, ...data };
        } catch (error) {
            logger.error('Error creating application:', error);
            throw error;
        }
    }

    async getApplications(type = null) {
        try {
            let sql = 'SELECT * FROM applications';
            const params = [];
            if (type) {
                sql += ' WHERE type = ?';
                params.push(type);
            }
            sql += ' ORDER BY created_at DESC';
            return await query(sql, params);
        } catch (error) {
            logger.error('Error fetching applications:', error);
            throw error;
        }
    }

    async updateStatus(id, status) {
        try {
            await query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
            return { id, status };
        } catch (error) {
            logger.error('Error updating application status:', error);
            throw error;
        }
    }
}

export default new ApplicationService();
