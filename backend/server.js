require('dotenv').config();
require('dns').setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/appliance_store';
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

connectDB();

// Routes
const customerRoutes = require('./routes/customers');
const applianceRoutes = require('./routes/appliances');
const inventoryRoutes = require('./routes/inventory');
app.use('/api/customers', customerRoutes);
app.use('/api/appliances', applianceRoutes);
app.use('/api/inventory', inventoryRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send("Jayalakshmi Computer's API is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
