const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[DEBUG] Incoming Request: ${req.method} ${req.url}`);
    console.log(`[DEBUG] Headers:`, req.headers);
    next();
});

let isConnected = false;
let connectionError = 'Waiting for connection...';
let dbPromise = null;

// Database connection & Sync
const connectDB = async () => {
    try {
        if (!sequelize) {
            connectionError = 'DATABASE_URL is not defined or database failed to initialize.';
            console.error(connectionError);
            throw new Error(connectionError);
        }

        console.log('Attempting to connect to MySQL...');
        await sequelize.authenticate();
        
        // Sync models safely
        await sequelize.sync();
        
        isConnected = true;
        connectionError = null;
        console.log('MySQL connected and synced successfully');
    } catch (error) {
        isConnected = false;
        connectionError = `MySQL connection error: ${error.message}`;
        console.error(connectionError);
        throw error;
    }
};

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        database: isConnected ? 'connected' : 'disconnected',
        details: connectionError,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Middleware to check DB connection for API calls
app.use(async (req, res, next) => {
    if (req.path.startsWith('/api')) {
        if (!isConnected) {
            try {
                if (!dbPromise) {
                    dbPromise = connectDB();
                }
                await dbPromise;
            } catch (err) {
                return res.status(503).json({ 
                    error: 'Database connection failed.',
                    details: connectionError || err.message
                });
            }
        }
    }
    next();
});

// Routes
const customerRoutes = require('./routes/customers');
const applianceRoutes = require('./routes/appliances');
const inventoryRoutes = require('./routes/inventory');

app.use('/api/customers', customerRoutes);
app.use('/api/appliances', applianceRoutes);
app.use('/api/inventory', inventoryRoutes);

// Serve static frontend files in production
const path = require('path');
const frontendDistPath = path.join(__dirname, '../dist');
app.use(express.static(frontendDistPath));

// Catch-all route to serve index.html for SPA frontend routing
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR:', err);
    res.status(500).json({
        error: 'A server error occurred',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start the server if executed directly (e.g., via 'npm start' in Vercel experimentalServices)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
