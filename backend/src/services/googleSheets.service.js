import { google } from 'googleapis';
import config from '../config/config.js';
import logger from '../config/logger.js';

class GoogleSheetsService {
    constructor() {
        this.sheets = null;
        this.auth = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Validate configuration
            if (!config.googleSheets.spreadsheetId) {
                throw new Error('Google Sheets Spreadsheet ID not configured');
            }
            if (!config.googleSheets.serviceAccountEmail || !config.googleSheets.privateKey) {
                throw new Error('Google Service Account credentials not configured');
            }

            // Create JWT auth client
            this.auth = new google.auth.JWT({
                email: config.googleSheets.serviceAccountEmail,
                key: config.googleSheets.privateKey,
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });

            // Initialize Sheets API
            this.sheets = google.sheets({ version: 'v4', auth: this.auth });
            this.initialized = true;

            logger.info('✅ Google Sheets API initialized successfully');
        } catch (error) {
            logger.error('❌ Failed to initialize Google Sheets API:', error);
            throw error;
        }
    }

    async appendToSheet(sheetName, values) {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            const response = await this.sheets.spreadsheets.values.append({
                spreadsheetId: config.googleSheets.spreadsheetId,
                range: `${sheetName}!A:Z`,
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'INSERT_ROWS',
                requestBody: {
                    values: [values]
                }
            });

            logger.info(`✅ Data appended to sheet: ${sheetName}`);
            return response.data;
        } catch (error) {
            logger.error(`❌ Failed to append to sheet ${sheetName}:`, error);
            throw error;
        }
    }

    async submitContactForm(formData) {
        const timestamp = new Date().toISOString();
        const values = [
            timestamp,
            formData.name,
            formData.email,
            formData.phone,
            formData.interest || '',
            formData.message
        ];

        return await this.appendToSheet('Contact_Form_Submissions', values);
    }

    async submitCareerApplication(formData) {
        // Legacy support or general career applications
        const timestamp = new Date().toISOString();
        const values = [
            timestamp,
            formData.fullName,
            formData.email,
            formData.phone,
            formData.position,
            formData.resumeLink || 'N/A',
            formData.coverLetter || ''
        ];

        return await this.appendToSheet('Career_Applications', values);
    }

    async submitInternshipApplication(formData) {
        const timestamp = new Date().toISOString();
        const values = [
            timestamp,
            formData.fullName,
            formData.email,
            formData.phone,
            formData.internshipTitle || 'General',
            formData.resumeLink || 'N/A',
            formData.message || ''
        ];

        return await this.appendToSheet('Internship_Applications', values);
    }

    async submitMentorApplication(formData) {
        const timestamp = new Date().toISOString();
        const values = [
            timestamp,
            formData.fullName,
            formData.email,
            formData.phone,
            formData.linkedinProfile || 'N/A',
            formData.experienceYears || 'N/A',
            formData.domainExpertise || 'N/A',
            formData.resumeLink || 'N/A'
        ];

        return await this.appendToSheet('Mentor_Applications', values);
    }

    async ensureSheetsExist() {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            // Get spreadsheet metadata
            const spreadsheet = await this.sheets.spreadsheets.get({
                spreadsheetId: config.googleSheets.spreadsheetId
            });

            const existingSheets = spreadsheet.data.sheets.map(s => s.properties.title);
            const requiredSheets = ['Contact_Form_Submissions', 'Career_Applications', 'Internship_Applications', 'Mentor_Applications'];
            const sheetsToCreate = requiredSheets.filter(s => !existingSheets.includes(s));

            if (sheetsToCreate.length > 0) {
                const requests = sheetsToCreate.map(title => ({
                    addSheet: {
                        properties: { title }
                    }
                }));

                await this.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: config.googleSheets.spreadsheetId,
                    requestBody: { requests }
                });

                logger.info(`✅ Created sheets: ${sheetsToCreate.join(', ')}`);
            }

            // Add headers if sheets are empty
            for (const sheetName of requiredSheets) {
                let headers = [];
                if (sheetName === 'Contact_Form_Submissions') {
                    headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Interest', 'Message'];
                } else if (sheetName === 'Career_Applications') {
                    headers = ['Timestamp', 'Full Name', 'Email', 'Phone', 'Position', 'Resume Link', 'Cover Letter'];
                } else if (sheetName === 'Internship_Applications') {
                    headers = ['Timestamp', 'Full Name', 'Email', 'Phone', 'Internship Title', 'Resume Link', 'Message'];
                } else if (sheetName === 'Mentor_Applications') {
                    headers = ['Timestamp', 'Full Name', 'Email', 'Phone', 'LinkedIn', 'Experience', 'Domain', 'Resume Link'];
                }

                // Check if sheet has data
                const values = await this.sheets.spreadsheets.values.get({
                    spreadsheetId: config.googleSheets.spreadsheetId,
                    range: `${sheetName}!A1:Z1`
                });

                if (!values.data.values || values.data.values.length === 0) {
                    await this.sheets.spreadsheets.values.update({
                        spreadsheetId: config.googleSheets.spreadsheetId,
                        range: `${sheetName}!A1`,
                        valueInputOption: 'USER_ENTERED',
                        requestBody: {
                            values: [headers]
                        }
                    });
                    logger.info(`✅ Added headers to ${sheetName}`);
                }
            }
        } catch (error) {
            logger.error('❌ Failed to ensure sheets exist:', error);
            throw error;
        }
    }

    async readFromSheet(sheetName) {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: config.googleSheets.spreadsheetId,
                range: `${sheetName}!A:Z`
            });

            const rows = response.data.values || [];
            if (rows.length === 0) {
                return { headers: [], data: [] };
            }

            const headers = rows[0];
            const data = rows.slice(1).map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index] || '';
                });
                return obj;
            });

            logger.info(`✅ Read ${data.length} rows from sheet: ${sheetName}`);
            return { headers, data };
        } catch (error) {
            logger.error(`❌ Failed to read from sheet ${sheetName}:`, error);
            throw error;
        }
    }

    async getAllApplications() {
        try {
            const [contactForms, internshipApps, mentorApps] = await Promise.all([
                this.readFromSheet('Contact_Form_Submissions'),
                this.readFromSheet('Internship_Applications'),
                this.readFromSheet('Mentor_Applications')
            ]);

            return {
                contact: contactForms.data,
                internship: internshipApps.data,
                mentor: mentorApps.data,
                all: [
                    ...contactForms.data.map(app => ({ ...app, type: 'contact' })),
                    ...internshipApps.data.map(app => ({ ...app, type: 'internship' })),
                    ...mentorApps.data.map(app => ({ ...app, type: 'mentor' }))
                ]
            };
        } catch (error) {
            logger.error('❌ Failed to get all applications:', error);
            throw error;
        }
    }
}

export default new GoogleSheetsService();
