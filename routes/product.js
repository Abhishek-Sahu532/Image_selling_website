const express = require('express');
const router  = express.Router();
const {isAuthenticated, isSeller, isBuyer} = require('../middlewares/auth')
const upload = require('../utils/FileUpload')
const Product = require('../models/productModel');
const {stripeKey} = require('../config')
const stripe = require('stripe')(stripeKey)
const {WebhookClient}  = require('discord.js')

//on discord select the channel, go to the setting and then click
//'Integration' -> 'Webhook' -> create Webhook -> go to the webhook ->copy the url
const webhook = new WebhookClient({
    url: 'https://discord.com/api/webhooks/1116783730070143119/6u7FgT7Gr0rD81C--xBh_zMivEHQMlFDmUV6mTbwIfL6D_Tzry5cFkv-5HSVLokjIbs2'
})
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

//stripe integration
router.post('/buy/:productId', isAuthenticated, isBuyer, async (req,res)=>{
    try {
        const productFind = await Product.findOne({where : {id: req.params.productId}})
        const product = productFind.dataValues;
        if(!product){
            return res.status(404).json({
                err: "No product found"
            })
        }

const orderDetails = {
    productId: req.params.productId,
    buyerId: req.user.id

}

//stripe

let paymentMethod = await stripe.paymentMethod.create({
    type: 'caard',
    card:{
        number:'123456565656565',//card number with specified length
        exp_month : 9,
        exp_year : 2023,
        cvc: '314'

    }//will get from the body
});

//create payment method
let paymentIntent = await stripe.paymentIntent.create({
    amount: product.price,
    currency: 'inr',
    payment_method_types: ['card'],
    payment_method: paymentMethod.id,
    confirm: true
})


//if order is successfull

if(paymentIntent){
    const createOrder = await Order.create(orderDetails);
    webhook.send({ //sending a msg to the discord channel when order is successful
        content: `I am sending it from day10 for order id ${createOrder.id}`,
        username:  'order_keeper', //order body,
avatarURL: 'url for avatar'
    })
    return res.status(200).json({createOrder})
}else{
    res.status(400).json({
        err: 'Payment failed'
    })
}
    } catch (error) {
        res.status(500).json({
            err: error
        })
    }
}  )



module.exports =  router