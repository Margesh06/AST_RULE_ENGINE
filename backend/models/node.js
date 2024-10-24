const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Rule = require('./rule');

const Node = sequelize.define('Node', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    rule_id: {
        type: DataTypes.UUID,
        references: {
            model: Rule,
            key: 'id',
        },
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.TEXT,
    },
    left_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    right_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    timestamps: false,
});

module.exports = Node;
