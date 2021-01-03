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
        allowNull: true
    },
    rider_id: {
        type: sequelize.UUID,
        allowNull: true
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
    },
    review:{
        type:sequelize.STRING,
		allowNull:true
    },
    items:{
        type:sequelize.ARRAY(sequelize.STRING),
        allowNull:false
    },
    itemsQuantity:{
        type:sequelize.ARRAY(sequelize.STRING),
        allowNull:false
    },
    image:{
        type:sequelize.STRING,
        allowNull:true
    }
},{
    freezeTableName:true
});

module.exports = Order;