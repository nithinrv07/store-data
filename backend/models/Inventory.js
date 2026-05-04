const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    model_number: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        default: 'General',
    },
    cost: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    min_stock_level: {
        type: Number,
        default: 5,
    },
    description: {
        type: String,
        trim: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
