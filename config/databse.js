const {Sequelize} = require('sequelize');

const db = new Sequelize('medicave', 'postgres', '1234', {
    host: 'localhost',
    dialect:  'postgres',
   // operatorsAliases: false,
    
    pool: {
        max: 5,
        min:0,
        acquire:30000,
        idle: 10000
    },
  });

  module.exports=db;
