const {DataTypes} = require('sequelize');
const { createDb } = require('../config/db');
// const userModel = require('../models/userModel')

//DEFINING THE SCHEMA FOR THE order TABLE
const Product = createDb.define('product',{
    id:{
        primaryKey: true,
        allowNull: false,
        autoIncrement:true,
        type:DataTypes.INTEGER
    },
   name: DataTypes.STRING,
   price: DataTypes.DECIMAL,
   content: DataTypes.STRING
})

// userModel.hasMany(Order, {foreignKey: 'id'})

module.exports = Product