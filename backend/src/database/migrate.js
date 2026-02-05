import mysql from 'mysql2/promise';
import config from '../config/config.js';
import logger from '../config/logger.js';

const migrations = [
    {
        name: 'create_courses_table',
        sql: `
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        short_description TEXT NOT NULL,
        full_description TEXT NOT NULL,
        duration VARCHAR(100) NOT NULL,
        mode ENUM('Online', 'Offline', 'Hybrid') DEFAULT 'Online',
        price DECIMAL(10, 2) DEFAULT NULL,
        thumbnail VARCHAR(500) DEFAULT NULL,
        category VARCHAR(100) NOT NULL,
        rating DECIMAL(2, 1) DEFAULT 0.0,
        enrollments VARCHAR(50) DEFAULT '0',
        modules INT DEFAULT 0,
        is_best_seller BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_is_active (is_active),
        INDEX idx_category (category),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
    },
    {
        name: 'create_admin_users_table',
        sql: `
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
    },
    {
        name: 'create_internships_table',
        sql: `
      CREATE TABLE IF NOT EXISTS internships (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(100) DEFAULT 'Remote',
        duration VARCHAR(100),
        stipend VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
    },
    {
        name: 'create_applications_table',
        sql: `
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('internship', 'mentor') NOT NULL,
        internship_id INT DEFAULT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        resume_link VARCHAR(500),
        message TEXT,
        status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE SET NULL,
        INDEX idx_type (type),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
    }
];

const runMigrations = async () => {
    let connection;

    try {
        // Create connection without database selection
        connection = await mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            port: config.database.port
        });

        logger.info('🔄 Starting database migrations...');

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database.database}`);
        logger.info(`✅ Database '${config.database.database}' ready`);

        // Use the database
        await connection.query(`USE ${config.database.database}`);

        // Run migrations
        for (const migration of migrations) {
            logger.info(`Running migration: ${migration.name}`);
            await connection.query(migration.sql);
            logger.info(`✅ Migration completed: ${migration.name}`);
        }

        logger.info('✅ All migrations completed successfully');

        // Create default admin user
        logger.info('');
        logger.info('🔐 Creating default admin user...');

        const bcrypt = (await import('bcryptjs')).default;
        const username = config.admin.username || 'admin';
        const password = config.admin.password || 'admin';
        const passwordHash = await bcrypt.hash(password, 10);

        // Check if admin user already exists
        const [existingUsers] = await connection.query(
            'SELECT * FROM admin_users WHERE username = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            logger.info(`ℹ️  Admin user '${username}' already exists`);
        } else {
            await connection.query(
                'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
                [username, passwordHash]
            );
            logger.info(`✅ Admin user created: ${username}`);
            logger.info(`   Password: ${password}`);
            logger.info('   ⚠️  Change default password in production!');
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

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigrations()
        .then(() => {
            logger.info('Migration script completed');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Migration script failed:', error);
            process.exit(1);
        });
}

export default runMigrations;
