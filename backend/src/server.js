import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/config.js';
import logger from './config/logger.js';
import { initDatabase } from './database/connection.js';
import runMigrations from './database/migrate.js';
import googleSheetsService from './services/googleSheets.service.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import formRoutes from './routes/form.routes.js';
import internshipRoutes from './routes/internship.routes.js';
import applicationRoutes from './routes/application.routes.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [config.frontendUrl];

        if (process.env.NODE_ENV === 'development') {
            allowedOrigins.push(
                'http://localhost:3000',
                'http://localhost:5173',
                'http://127.0.0.1:3000',
                'http://127.0.0.1:5173'
            );
        }

        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize and start server
const startServer = async () => {
    try {
        logger.info('🚀 Starting Apex Skills Backend...');

        // Run database migrations
        await runMigrations();

        // Initialize database connection
        await initDatabase();

        // Initialize Google Sheets (optional - will warn if not configured)
        try {
            await googleSheetsService.initialize();
            await googleSheetsService.ensureSheetsExist();
        } catch (error) {
            logger.warn('⚠️  Google Sheets not configured. Form submissions will fail.');
            logger.warn('Please configure GOOGLE_SHEETS_SPREADSHEET_ID and service account credentials.');
        }

        // Start listening
        app.listen(config.port, () => {
            logger.info(`✅ Server running on port ${config.port}`);
            logger.info(`✅ Environment: ${config.env}`);
            logger.info(`✅ Frontend URL: ${config.frontendUrl}`);
            logger.info('');
            logger.info('📋 Available endpoints:');
            logger.info('   GET  /health');
            logger.info('   POST /api/auth/login');
            logger.info('   POST /api/auth/verify');
            logger.info('   GET  /api/courses');
            logger.info('   POST /api/forms/contact');
            logger.info('   POST /api/forms/career');
            logger.info('');
            logger.info('🔐 Admin endpoints (require authentication):');
            logger.info('   GET    /api/courses/all');
            logger.info('   POST   /api/courses');
            logger.info('   PUT    /api/courses/:id');
            logger.info('   DELETE /api/courses/:id');
            logger.info('   PATCH  /api/courses/:id/toggle-visibility');
        });
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    process.exit(1);
});

startServer();

export default app;
