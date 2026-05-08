require('dotenv').config();
try {
    require('dns').setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.warn('Could not set DNS servers:', e.message);
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

let isConnected = false;

// Database connection
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('MONGODB_URI is not defined in environment variables');
            return;
        }
        await mongoose.connect(uri);
        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

connectDB();

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        database: isConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Middleware to check DB connection
app.use((req, res, next) => {
    if (!isConnected && req.path.startsWith('/api')) {
        return res.status(503).json({ error: 'Database not connected. Please check MONGODB_URI.' });
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
