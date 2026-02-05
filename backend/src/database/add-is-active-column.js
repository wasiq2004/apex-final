import mysql from 'mysql2/promise';
import config from '../config/config.js';
import logger from '../config/logger.js';

const addIsActiveColumn = async () => {
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

        logger.info('🔄 Adding is_active column to courses table...');

        // Check if column already exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'courses' 
            AND COLUMN_NAME = 'is_active'
        `, [config.database.database]);

        if (columns.length > 0) {
            logger.info('ℹ️  Column is_active already exists in courses table');
        } else {
            // Add the is_active column
            await connection.query(`
                ALTER TABLE courses 
                ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER is_best_seller
            `);

            // Add index for is_active
            await connection.query(`
                ALTER TABLE courses 
                ADD INDEX idx_is_active (is_active)
            `);

            logger.info('✅ Column is_active added successfully to courses table');
        }

        // Check if is_best_seller column exists
        const [bestSellerColumns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'courses' 
            AND COLUMN_NAME = 'is_best_seller'
        `, [config.database.database]);

        if (bestSellerColumns.length === 0) {
            logger.info('Adding is_best_seller column...');
            await connection.query(`
                ALTER TABLE courses 
                ADD COLUMN is_best_seller BOOLEAN DEFAULT FALSE AFTER modules
            `);
            logger.info('✅ Column is_best_seller added successfully');
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
    addIsActiveColumn()
        .then(() => {
            logger.info('Migration script completed');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Migration script failed:', error);
            process.exit(1);
        });
}

export default addIsActiveColumn;
