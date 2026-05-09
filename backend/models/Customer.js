const { DataTypes } = require('sequelize');
const sequelize = require('../db');

if (!sequelize) {
    console.error('Customer model could not be initialized: Sequelize is null');
    module.exports = {}; // Export empty object to prevent crashes
    return;
}

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Customer;
