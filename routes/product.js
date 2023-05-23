const express = require('express');
const router  = express.Router();
const {isAuthenticated, isSeller} = require('../middlewares/auth')
const upload = require('../utils/FileUpload')


//ROUTE FOR ADDING THE PRODUCT
router.post('/create', isAuthenticated, isSeller,  (req, res)=>{//all are middlewares, that will call by one if everything is going as planned

upload(req, res,async (err)=>{
    if(err){
        console.log(err)
        return res.status(500).send(err)
    }
    const {name, price} = req.body;
    if(!name || !price  || !req.file){
        return res.status(400).json({
            err: "PLEASE ENTER THE NAME, PRICE AND ADD THE FILE"
        })
    }
    if(Number.isNaN(price)){
        return res.status(400).json({
            err: "Price should be in number"
        })
    }
let productDetail = {
    name, price, content: req.file.path
}

return res.status(200).json({
    status: "OK",
    productDetail
})
} )
})









module.exports =  router