const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Customer = require('./Customer');

const Appliance = sequelize.define('Appliance', {
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
    serial_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'Laptops'
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    purchase_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    warranty_expiration: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

// Relationships
Appliance.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Appliance, { foreignKey: 'customer_id' });

module.exports = Appliance;
