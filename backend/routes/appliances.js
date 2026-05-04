const express = require('express');
const router = express.Router();
const Appliance = require('../models/Appliance');

// Get all Appliances
router.get('/', async (req, res) => {
    try {
        const appliances = await Appliance.find();
        res.json(appliances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Appliance
router.post('/', async (req, res) => {
    try {
        const appliance = new Appliance(req.body);
        const savedAppliance = await appliance.save();
        res.status(201).json(savedAppliance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Appliances for a Customer
router.get('/customer/:customerId', async (req, res) => {
    try {
        const appliances = await Appliance.find({ customer_id: req.params.customerId });
        res.json(appliances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Appliance
router.put('/:id', async (req, res) => {
    try {
        const updatedAppliance = await Appliance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedAppliance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Appliance
router.delete('/:id', async (req, res) => {
    try {
        await Appliance.findByIdAndDelete(req.params.id);
        res.json({ message: 'Appliance deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
