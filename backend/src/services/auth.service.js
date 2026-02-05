import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { query } from '../database/connection.js';
import logger from '../config/logger.js';

class AuthService {
    async login(username, password) {
        try {
            // Check against environment variables first (for initial setup)
            if (username === config.admin.username && password === config.admin.password) {
                const token = this.generateToken({ username, role: 'admin' });
                logger.info(`✅ Admin logged in: ${username}`);
                return { token, username };
            }

            // Check database for additional admin users
            const sql = 'SELECT * FROM admin_users WHERE username = ?';
            const users = await query(sql, [username]);

            if (users.length === 0) {
                throw new Error('Invalid credentials');
            }

            const user = users[0];
            const isValidPassword = await bcrypt.compare(password, user.password_hash);

            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            // Update last login
            await query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);

            const token = this.generateToken({ id: user.id, username: user.username, role: 'admin' });
            logger.info(`✅ Admin logged in: ${username}`);

            return { token, username: user.username };
        } catch (error) {
            logger.error('Login failed:', error);
            throw error;
        }
    }

    generateToken(payload) {
        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, config.jwt.secret);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    async createAdminUser(username, password) {
        try {
            const passwordHash = await bcrypt.hash(password, 10);
            const sql = 'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)';

            const result = await query(sql, [username, passwordHash]);
            logger.info(`✅ Admin user created: ${username}`);

            return { id: result.insertId, username };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Username already exists');
            }
            logger.error('Error creating admin user:', error);
            throw error;
        }
    }
}

export default new AuthService();
