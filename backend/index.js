const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

let isConnected = false;
let connectionError = 'Waiting for connection...';

// Global variable to cache the connection
let cachedDb = null;

// Database connection function
const connectDB = async () => {
    if (cachedDb && mongoose.connection.readyState === 1) {
        isConnected = true;
        return cachedDb;
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            connectionError = 'MONGODB_URI is not defined in environment variables.';
            console.error(connectionError);
            return;
        }

        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            socketTimeoutMS: 45000,
            family: 4, // Force IPv4
        });

        cachedDb = conn;
        isConnected = true;
        connectionError = null;
        console.log('MongoDB connected successfully');
        return conn;
    } catch (error) {
        isConnected = false;
        connectionError = `MongoDB connection error: ${error.message}`;
        console.error(connectionError);
    }
};

// Initiate connection
connectDB();

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        database: isConnected ? 'connected' : 'disconnected',
        error: connectionError,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Middleware to check DB connection
app.use((req, res, next) => {
    if (!isConnected && req.path.startsWith('/api')) {
        return res.status(503).json({ 
            error: 'Database not connected.',
            details: connectionError,
            help: 'Please check your MONGODB_URI in Vercel Dashboard.'
        });
    }
    next();
});

const path = require('path');

// Routes
const customerRoutes = require('./routes/customers');
const applianceRoutes = require('./routes/appliances');
const inventoryRoutes = require('./routes/inventory');

app.use('/api/customers', customerRoutes);
app.use('/api/appliances', applianceRoutes);
app.use('/api/inventory', inventoryRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
