import mysql from 'mysql2/promise';
import config from '../config/config.js';
import logger from '../config/logger.js';

/**
 * Sample courses to seed the database
 */
const sampleCourses = [
    {
        title: 'Full Stack Web Development',
        slug: 'full-stack-web-development',
        short_description: 'Master frontend and backend technologies to build scalable enterprise-grade web applications.',
        full_description: 'This comprehensive course covers everything you need to become a full-stack developer. You\'ll learn HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, and deployment strategies. Through hands-on projects, you\'ll build real-world applications and gain the skills needed to excel in the industry.\n\nWhat you\'ll learn:\n- Modern JavaScript (ES6+)\n- React.js and state management\n- Node.js and Express.js\n- RESTful API design\n- Database design (SQL & NoSQL)\n- Authentication & Authorization\n- Deployment and DevOps basics\n- Testing and debugging\n\nThis course includes lifetime access, 50+ hours of video content, and real-world projects.',
        duration: '3 Months',
        mode: 'Online',
        price: 29999,
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200',
        category: 'Computer Science',
        rating: 4.9,
        enrollments: '15K+',
        modules: 12,
        is_best_seller: true,
        is_active: true
    },
    {
        title: 'Python Programming & Automation',
        slug: 'python-programming-automation',
        short_description: 'Learn Python for scripting, automation, and core development with hands-on project exposure.',
        full_description: 'Master Python programming from basics to advanced concepts. This course is perfect for beginners and those looking to automate tasks, analyze data, or build applications.\n\nCourse Highlights:\n- Python fundamentals and syntax\n- Object-oriented programming\n- File handling and data processing\n- Web scraping with BeautifulSoup\n- Automation with Selenium\n- Data analysis with Pandas\n- API integration\n- Building CLI tools\n\nIncludes 40+ hours of content, 100+ coding exercises, and 10 real-world projects.',
        duration: '2 Months',
        mode: 'Online',
        price: 19999,
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=1200',
        category: 'Computer Science',
        rating: 4.8,
        enrollments: '12K+',
        modules: 10,
        is_best_seller: true,
        is_active: true
    },
    {
        title: 'Data Science & Analytics',
        slug: 'data-science-analytics',
        short_description: 'Transform raw data into strategic assets. Learn predictive modeling and ethical AI at scale.',
        full_description: 'Become a data scientist and unlock the power of data. This comprehensive program covers statistics, machine learning, data visualization, and real-world applications.\n\nWhat You\'ll Master:\n- Statistical analysis and probability\n- Python for data science (NumPy, Pandas, Matplotlib)\n- Machine learning algorithms\n- Deep learning basics\n- Data visualization with Tableau/Power BI\n- SQL for data analysis\n- Big data technologies\n- A/B testing and experimentation\n\nIncludes 60+ hours of video, 15 projects, and industry case studies.',
        duration: '3 Months',
        mode: 'Hybrid',
        price: 39999,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
        category: 'Computer Science',
        rating: 4.7,
        enrollments: '20K+',
        modules: 14,
        is_best_seller: true,
        is_active: true
    },
    {
        title: 'AI & Machine Learning',
        slug: 'ai-machine-learning',
        short_description: 'Master the next frontier of intelligence. Built for architects looking to dominate the AI landscape.',
        full_description: 'Dive deep into artificial intelligence and machine learning. Learn to build intelligent systems that can learn, adapt, and make decisions.\n\nCurriculum:\n- Introduction to AI and ML\n- Supervised and unsupervised learning\n- Neural networks and deep learning\n- Natural Language Processing (NLP)\n- Computer Vision\n- Reinforcement learning\n- Model deployment and MLOps\n- Ethics in AI\n- TensorFlow and PyTorch\n\nIncludes 70+ hours of content, 20+ projects, and capstone project.',
        duration: '4 Months',
        mode: 'Online',
        price: 49999,
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
        category: 'Computer Science',
        rating: 4.9,
        enrollments: '35K+',
        modules: 16,
        is_best_seller: true,
        is_active: true
    },
    {
        title: 'Digital Marketing & Growth',
        slug: 'digital-marketing-growth',
        short_description: 'Strategies for growth, SEO, SEM, and performance marketing in a digital-first economy.',
        full_description: 'Master digital marketing and drive business growth. Learn proven strategies used by top companies to acquire and retain customers.\n\nTopics Covered:\n- Digital marketing fundamentals\n- SEO and content marketing\n- Google Ads and PPC\n- Social media marketing\n- Email marketing automation\n- Analytics and data-driven decisions\n- Conversion rate optimization\n- Growth hacking techniques\n\nIncludes 35+ hours of training, real campaigns, and certification.',
        duration: '2 Months',
        mode: 'Online',
        price: 24999,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
        category: 'Management',
        rating: 4.6,
        enrollments: '8K+',
        modules: 8,
        is_best_seller: false,
        is_active: true
    },
    {
        title: 'HR Fundamentals',
        slug: 'hr-fundamentals',
        short_description: 'Understand modern workplace dynamics, talent acquisition, and professional management protocol.',
        full_description: 'Build a strong foundation in human resources management. Learn to attract, develop, and retain top talent while fostering a positive workplace culture.\n\nKey Learning Areas:\n- HR strategy and planning\n- Recruitment and selection\n- Employee onboarding\n- Performance management\n- Compensation and benefits\n- Employee relations\n- HR analytics\n- Labor laws and compliance\n\nIncludes 30+ hours of content, case studies, and HR toolkit.',
        duration: '2 Months',
        mode: 'Offline',
        price: 18999,
        thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200',
        category: 'Management',
        rating: 4.5,
        enrollments: '5K+',
        modules: 9,
        is_best_seller: false,
        is_active: true
    }
];

const seedCourses = async () => {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.database,
            port: config.database.port
        });

        logger.info('🌱 Starting course seeding...');

        for (const course of sampleCourses) {
            const sql = `
                INSERT INTO courses (
                    title, slug, short_description, full_description,
                    duration, mode, price, thumbnail, category,
                    rating, enrollments, modules, is_best_seller, is_active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await connection.query(sql, [
                course.title,
                course.slug,
                course.short_description,
                course.full_description,
                course.duration,
                course.mode,
                course.price,
                course.thumbnail,
                course.category,
                course.rating,
                course.enrollments,
                course.modules,
                course.is_best_seller,
                course.is_active
            ]);

            logger.info(`✅ Seeded: ${course.title}`);
        }

        logger.info(`✅ Successfully seeded ${sampleCourses.length} courses`);

    } catch (error) {
        logger.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedCourses()
        .then(() => {
            logger.info('Seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Seeding failed:', error);
            process.exit(1);
        });
}

export default seedCourses;
