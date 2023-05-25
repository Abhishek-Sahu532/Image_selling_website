const {Sequelize} = require('sequelize');

//CREATING THE DB
const createDb = new Sequelize('test-db', 'user', 'pass',{
    dialect: 'sqlite',
    host:'./config/db.sqlite',
})
//CREATING CONNECTION
const connectDB = () =>{
    createDb.sync().then(()=>{
        console.log('connected to db')
    }).catch((e)=>{
        console.log('Connection failed' , e)
    })
}



module.exports = {createDb, connectDB}