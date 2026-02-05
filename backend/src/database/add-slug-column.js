import mysql from 'mysql2/promise';
import config from '../config/config.js';
import logger from '../config/logger.js';

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
};

const addSlugColumn = async () => {
    let connection;

    try {
        // Create connection
        connection = await mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            port: config.database.port,
            database: config.database.database
        });

        logger.info('🔄 Checking slug column in courses table...');

        // Check if column already exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'courses' 
            AND COLUMN_NAME = 'slug'
        `, [config.database.database]);

        if (columns.length > 0) {
            logger.info('ℹ️  Column slug already exists in courses table');
        } else {
            logger.info('Adding slug column...');

            // 1. Add column as NULLable first
            await connection.query(`
                ALTER TABLE courses 
                ADD COLUMN slug VARCHAR(255) AFTER title
            `);

            // 2. Populate slugs for existing records
            const [courses] = await connection.query('SELECT id, title FROM courses');
            logger.info(`Found ${courses.length} courses to update with slugs`);

            for (const course of courses) {
                let slug = generateSlug(course.title);
                // Ensure uniqueness (simple check)
                let suffix = 1;
                while (true) {
                    const [existing] = await connection.query('SELECT id FROM courses WHERE slug = ? AND id != ?', [slug, course.id]);
                    if (existing.length === 0) break;
                    slug = `${generateSlug(course.title)}-${suffix++}`;
                }

                await connection.query('UPDATE courses SET slug = ? WHERE id = ?', [slug, course.id]);
            }

            // 3. Make it NOT NULL and UNIQUE
            await connection.query(`
                ALTER TABLE courses 
                MODIFY COLUMN slug VARCHAR(255) NOT NULL,
                ADD UNIQUE INDEX idx_slug (slug)
            `);

            logger.info('✅ Column slug added and populated successfully');
        }

    } catch (error) {
        logger.error('❌ Migration failed:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    addSlugColumn()
        .then(() => {
            logger.info('Migration script completed');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Migration script failed:', error);
            process.exit(1);
        });
}

export default addSlugColumn;
