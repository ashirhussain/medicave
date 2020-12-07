const sequelize = require('sequelize');
const db =require('../../config/databse');
const Order=require('./order');

const Admin = db.define('admin',{
    id:{
        type: sequelize.UUID,
        defaultValue:sequelize.UUIDV4,
        primaryKey:true
    },

    full_name:{
        type:sequelize.STRING,
        allowNull:false
    },

    email:{
        type:sequelize.STRING,
        allowNull:false
    },

    password:{
        type:sequelize.STRING,
        allowNull:false
    },

    phone:{
        type:sequelize.STRING,
        allowNull:false
    },
    
    createdAt:{
        type:sequelize.DATE,
        allowNull:true
    },
    updatedAt:{
        type:sequelize.DATE,
        allowNull:true
    },
},{
    freezeTableName:true
});
// User.hasMany(Orders,{
//     foreignKey: 'customer_id',
//     onDelete:'cascade',
//     hooks: true
// });
// User.hasMany(Orders,{
//     foreignKey: 'seller_id',
//     onDelete:'cascade',
//     hooks: true
// });
// User.hasMany(Orders,{
//     foreignKey: 'rider_id',
//     onDelete:'cascade',
//     hooks: true
// });
// Orders.belongsTo(User, {
//     foreignKey: 'customer_id'
// });
// Orders.belongsTo(User, {
//     foreignKey: 'seller_id'
// });
// Orders.belongsTo(User, {
//     foreignKey: 'rider_id'
// });
module.exports= Admin;