const sequelize = require('sequelize');
const db = require('../../config/databse');
// const User = require('./user');

const Order = db.define('order', {

    id: {
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true
    },

    customer_id: {
        type: sequelize.UUID,
        allowNull: false
    },
    seller_id: {
        type: sequelize.UUID,
        allowNull: false
    },
    rider_id: {
        type: sequelize.UUID,
        allowNull: false
    },
    iscompleted: {
        type: sequelize.BOOLEAN,
        allowNull: true
    },
    inprocess: {
        type: sequelize.BOOLEAN,
        allowNull: true
    },
    riderRating: {
        type: sequelize.INTEGER,
        allowNull: true
    },
    sellerRating: {
        type: sequelize.INTEGER,
        allowNull: true
    },
    isdelete: {
        type: sequelize.BOOLEAN,
        allowNull: true
    },
    description:{
        type:sequelize.STRING,
		allowNull:true
    }
},{
    freezeTableName:true
});

module.exports = Order;