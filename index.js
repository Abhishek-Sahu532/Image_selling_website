const express = require('express');
const app = express();
const { connectDB  } = require("./config/db");
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')

//middlewares()
app.use(express.json());
app.use(express.static('content'))//accepting the html file with content folder
app.use(express.urlencoded({extended:false}));

const PORT = 1338;

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/product', productRoutes)
app.get('/', (req, res)=>{
    return res.status(201).send('Home page, API working')
})

app.listen(PORT, ()=>{
    console.log('App is running');
//   console.log(connectDB)
connectDB()
})