import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import config from '../config/config.js';
import logger from '../config/logger.js';

/**
 * Create default admin user in database
 */
const createAdminUser = async () => {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.database,
            port: config.database.port
        });

        logger.info('🔐 Creating admin user...');

        // Admin credentials from environment variables
        const username = config.admin.username || 'admin';
        const password = config.admin.password || 'admin';

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Check if admin user already exists
        const [existingUsers] = await connection.query(
            'SELECT * FROM admin_users WHERE username = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            logger.info(`ℹ️  Admin user '${username}' already exists`);
            logger.info('✅ Skipping creation');
            return;
        }

        // Insert admin user
        await connection.query(
            'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
            [username, passwordHash]
        );

        logger.info(`✅ Admin user created successfully`);
        logger.info(`   Username: ${username}`);
        logger.info(`   Password: ${password}`);
        logger.info('');
        logger.info('⚠️  IMPORTANT: Change the default password in production!');

    } catch (error) {
        logger.error('❌ Failed to create admin user:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    createAdminUser()
        .then(() => {
            logger.info('Admin user creation completed');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Admin user creation failed:', error);
            process.exit(1);
        });
}

export default createAdminUser;
