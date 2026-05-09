const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'General'
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    min_stock_level: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Inventory;
