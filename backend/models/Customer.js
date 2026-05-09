const { DataTypes } = require('sequelize');
const sequelize = require('../db');

if (!sequelize) {
    console.error('Customer model could not be initialized: Sequelize is null');
    module.exports = {
        create: () => Promise.reject(new Error('DB not connected')),
        findAll: () => Promise.resolve([]),
        findByPk: () => Promise.resolve(null),
        update: () => Promise.reject(new Error('DB not connected')),
        destroy: () => Promise.reject(new Error('DB not connected'))
    };
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
