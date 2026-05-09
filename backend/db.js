const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('CRITICAL: DATABASE_URL is missing!');
}

let sequelize = null;

if (dbUrl) {
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
}

module.exports = sequelize;
