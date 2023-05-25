const express = require('express');
const router  = express.Router();
const {isAuthenticated, isSeller, isBuyer} = require('../middlewares/auth')
const upload = require('../utils/FileUpload')
const Product = require('../models/productModel');


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

const savedProduct = await Product.create(productDetail);



return res.status(200).json({
    status: "OK",
    productDetail :savedProduct
})
} )
})



router.get('/get/all', isAuthenticated,async(req, res)=>{
    try {
        const products = await Product.findAll();
    return res.status(200).json({
        products
    })
    } catch (error) {
        res.status(500).json({
            err: error
        })
    }
})


router.post('/buy/:productId', isAuthenticated, isBuyer, async (req,res)=>{
    try {
        const product = await Product.findOne({where : {id: req.params.productId}})?.dataValues;
        if(!product){
            return res.status(404).json({
                err: "No product found"
            })
        }

const orderDetails = {
    productId,
    buyerId: req.user.id

}

    } catch (error) {
        res.status(500).json({
            err: error
        })
    }
}  )



module.exports =  router