const sequelize = require('sequelize');
const db =require('../../config/databse');
// const Order=require('./order');

const Verification = db.define('verification',{
    id:{
        type: sequelize.UUID,
        defaultValue:sequelize.UUIDV4,
        primaryKey:true
    },  
    token:{
        type:sequelize.STRING,
        allowNull:false
    },
    customer_id:{
        type:sequelize.UUID,
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


module.exports= Verification;