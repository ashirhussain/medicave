const sequelize = require('sequelize');
const db =require('../../config/databse');
const Order=require('./order');
const Verification=require('./verification');

const Customer = db.define('customer',{
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
    date_of_birth:{
        type:sequelize.DATE,
        allowNull:true
    },

    cnic:{
        type:sequelize.STRING,
        allowNull:false
    },
    phone:{
        type:sequelize.STRING,
        allowNull:false
    },
    address:{
        type:sequelize.STRING,
        allowNull:true
    },

    latitude:{
        type:sequelize.DOUBLE,
        allowNull:true
    },
    longitude:{
        type:sequelize.DOUBLE,
        allowNull:true
    },
   
    createdAt:{
        type:sequelize.DATE,
        allowNull:true
    },
    updatedAt:{
        type:sequelize.DATE,
        allowNull:true
    },
    isDelete:{
        type:sequelize.BOOLEAN,
        allowNull:true
    },
    isVerified:{
        type:sequelize.BOOLEAN,
        allowNull:false
    },
    inActive:{
        type:sequelize.BOOLEAN,
        allowNull:true
    },
   
},{
    freezeTableName:true
});

Customer.hasMany(Order,{
    foreignKey: 'customer_id',
    onDelete:'cascade',
    hooks: true
});
Order.belongsTo(Customer, {
    foreignKey: 'customer_id'
});

Customer.hasOne(Verification,{
    foreignKey: 'customer_id',
    onDelete:'cascade',
    hooks: true
});
Verification.belongsTo(Customer, {
    foreignKey: 'customer_id'
});
module.exports= Customer;