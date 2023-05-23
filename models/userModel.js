const {DataTypes} = require('sequelize');
const { createDb } = require('../config/db');


//DEFINING THE SCHEMA FOR THE USER TABLE
const User = createDb.define('users',{
    id:{
        primaryKey: true,
        allowNull: false,
        autoIncrement:true,
        type:DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isSeller:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})


module.exports = User