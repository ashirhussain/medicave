const sequelize = require('sequelize');
const db =require('../../config/databse');
const Roles=require('./roles');

const User = db.define('user',{
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
        allowNull:false
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
    driving_license:{
        type:sequelize.STRING,
        allowNull:true
    },
    pharmacy_license:{
        type:sequelize.STRING,
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
    is_delete:{
        type:sequelize.BOOLEAN,
        allowNull:true
    },
    inactive:{
        type:sequelize.BOOLEAN,
        allowNull:true
    },
    user_role:{
        type:sequelize.UUID,
        allowNull:false
    },
    isverified:{
        type:sequelize.BOOLEAN,
        allowNull:false
    }
},{
    freezeTableName:true
});

module.exports= User;