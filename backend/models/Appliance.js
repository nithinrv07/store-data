const mongoose = require('mongoose');

const applianceSchema = new mongoose.Schema({
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
    serial_number: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        default: 'General',
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    cost: {
        type: Number,
        required: true,
        default: 0,
    },
    purchase_date: {
        type: Date,
        required: true,
    },
    warranty_expiration: {
        type: Date,
        required: true,
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Appliance', applianceSchema);
