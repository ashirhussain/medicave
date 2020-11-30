const sequelize = require('sequelize');
const db = require('../../config/databse');
const User=require('../models/user');

const Roles = db.define('roles', {

    id: {
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true
    },

    name: {
        type: sequelize.STRING,
        allowNull: false
    },

    description: {
        type: sequelize.STRING,
        allowNull: true
    }
});
Roles.hasMany(User, {
    foreignKey: "user_role",
    onDelete: 'cascade',
    hooks: true
});


User.belongsTo(Roles, {
    foreignKey: "user_role",
});


module.exports = Roles;