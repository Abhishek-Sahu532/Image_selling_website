const {DataTypes} = require('sequelize');
const { createDb } = require('../config/db');


//DEFINING THE SCHEMA FOR THE order TABLE
const User = createDb.define('order',{
    id:{
        primaryKey: true,
        allowNull: false,
        autoIncrement:true,
        type:DataTypes.INTEGER
    },
    productId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
})


module.exports = User