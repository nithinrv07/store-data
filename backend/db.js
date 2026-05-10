const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use environment variable for production (e.g. Vercel)
const dbUrl = process.env.DATABASE_URL;

let sequelize = null;

if (dbUrl) {
    console.log('Connecting to remote MySQL database...');
    try {
        sequelize = new Sequelize(dbUrl, {
            dialect: 'mysql',
            logging: false,
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: false
                }
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
    } catch (err) {
        console.error('CRITICAL: Failed to initialize Sequelize with the provided DATABASE_URL:', err.message);
        sequelize = null;
    }
} else {
    console.log('No DATABASE_URL provided. Falling back to local SQLite database.');
    try {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: './database.sqlite',
            logging: false
        });
    } catch (err) {
        console.error('CRITICAL: Failed to initialize local SQLite:', err.message);
        sequelize = null;
    }
}

module.exports = sequelize;
