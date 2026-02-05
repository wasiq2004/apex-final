
import mysql from 'mysql2/promise';
import config from '../config/config.js';

const checkDb = async () => {
    try {
        const connection = await mysql.createConnection(config.database);
        console.log('Connected to database:', config.database.database);

        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables:', tables);

        for (const tableObj of tables) {
            const tableName = Object.values(tableObj)[0];
            const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
            console.log(`Table ${tableName}: ${rows[0].count} rows`);
        }

        // Check admin user specifically
        const [admins] = await connection.query('SELECT username FROM admin_users');
        console.log('Admin users:', admins);

        await connection.end();
    } catch (error) {
        console.error('DB Check Failed:', error);
    }
};

checkDb();
