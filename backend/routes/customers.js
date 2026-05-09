const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Create Customer
router.post('/', async (req, res) => {
    try {
        const savedCustomer = await Customer.create(req.body);
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.findAll({ order: [['createdAt', 'DESC']] });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single Customer
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Customer
router.put('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        await customer.update(req.body);
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Customer
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        await customer.destroy();
        res.json({ message: 'Customer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
