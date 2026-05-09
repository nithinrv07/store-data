const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Create Inventory
router.post('/', async (req, res) => {
    try {
        const savedItem = await Inventory.create(req.body);
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Inventory
router.get('/', async (req, res) => {
    try {
        const items = await Inventory.findAll({ order: [['createdAt', 'DESC']] });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Inventory
router.put('/:id', async (req, res) => {
    try {
        const item = await Inventory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        await item.update(req.body);
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Inventory
router.delete('/:id', async (req, res) => {
    try {
        const item = await Inventory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        await item.destroy();
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
