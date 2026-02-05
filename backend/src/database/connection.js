import mysql from 'mysql2/promise';
import config from '../config/config.js';
import logger from '../config/logger.js';

let pool;

export const initDatabase = async () => {
    try {
        pool = mysql.createPool(config.database);

        // Test connection
        const connection = await pool.getConnection();
        logger.info('✅ Database connected successfully');
        connection.release();

        return pool;
    } catch (error) {
        logger.error('❌ Database connection failed:', error);
        throw error;
    }
};

export const getPool = () => {
    if (!pool) {
        throw new Error('Database pool not initialized. Call initDatabase() first.');
    }
    return pool;
};

export const query = async (sql, params) => {
    const connection = await getPool().getConnection();
    try {
        const [results] = await connection.execute(sql, params);
        return results;
    } catch (error) {
        logger.error('Database query error:', error);
        throw error;
    } finally {
        connection.release();
    }
};

export default { initDatabase, getPool, query };
