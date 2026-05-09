const express = require('express');
const router = express.Router();
const Appliance = require('../models/Appliance');

// Create Sale (Appliance)
router.post('/', async (req, res) => {
    try {
        const savedAppliance = await Appliance.create(req.body);
        res.status(201).json(savedAppliance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Sales
router.get('/', async (req, res) => {
    try {
        const appliances = await Appliance.findAll({ order: [['createdAt', 'DESC']] });
        res.json(appliances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Sales for a specific Customer
router.get('/customer/:id', async (req, res) => {
    try {
        const appliances = await Appliance.findAll({ 
            where: { customer_id: req.params.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(appliances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Sale
router.put('/:id', async (req, res) => {
    try {
        const appliance = await Appliance.findByPk(req.params.id);
        if (!appliance) return res.status(404).json({ message: 'Sale record not found' });
        await appliance.update(req.body);
        res.json(appliance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Sale
router.delete('/:id', async (req, res) => {
    try {
        const appliance = await Appliance.findByPk(req.params.id);
        if (!appliance) return res.status(404).json({ message: 'Sale record not found' });
        await appliance.destroy();
        res.json({ message: 'Sale record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
