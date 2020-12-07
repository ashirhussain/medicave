const sequelize = require('sequelize');
const db =require('../../config/databse');
const Order=require('./order');

const Rider = db.define('rider',{
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
    driving_license:{
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
    isDelete:{
        type:sequelize.BOOLEAN,
        allowNull:true
    },
    inActive:{
        type:sequelize.BOOLEAN,
        allowNull:true
    },
    isVerified:{
        type:sequelize.BOOLEAN,
        allowNull:false
    },
    rating:{
        type:sequelize.DOUBLE,
        allowNull:true
    }
},{
    freezeTableName:true
});
Rider.hasMany(Order,{
    foreignKey: 'rider_id',
    onDelete:'cascade',
    hooks: true
});
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
Order.belongsTo(Rider, {
    foreignKey: 'rider_id'
});
// Orders.belongsTo(User, {
//     foreignKey: 'seller_id'
// });
// Orders.belongsTo(User, {
//     foreignKey: 'rider_id'
// });
module.exports= Rider;