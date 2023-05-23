const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {
    validateName,
    validateEmail,
    validatePassword
} = require('../utils/validator')

router.post('/signup', async (req, res)=>{
 try {
    const {name, email, password, isSeller} = req.body; //destructuring the object for request body
    const existingUser = await User.findOne({where: {email}}); //check the use is already exixts or not with the email
    if(existingUser){
        return res.status(403).json({err: 'User already exists'})
    }
    if(!validateName(name)){
        return res.status(400).json({err: 'Name validates fails'})
    }
    if(!validateEmail(email)){
        return res.status(400).json({err: 'Error: Invalid Email'})
    }
    if(!validatePassword(password)){
        return res.status(400).json({err: 'Error: Password must be at least 8 characters long,  and must include atleast one - one uppercase letter, one lowercase letter, one digit, one special character.'})
    }

const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10)); //hashes the password with a salt, generated with the specified number of rounds

const user ={
    email,
    name,
    isSeller,
    password: hashedPassword
};//creating the user

const createdUser = await User.create(user);

return res.status(201).json({
    message: `Welcome  ${createdUser.name}. Thankyou for signing up.`
});
} catch (error) {
    console.log(error)
    return res.status(500).send(error)
 }
} )


router.post('/signin',async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(email.length ===0){
            return res.return(400).json({
                err: "Please provide the email"
            })
        }
        if(email.password ===0){
            return res.return(400).json({
                err: "Please provide the password"
            })
        }
const existingUser = await User.findOne({where: {email}});
if(!existingUser){
    return res.status(404).json({
        err: "User not found"
    })
}

const passwordMatched = await bcrypt.compare(password, existingUser.password);

if(!passwordMatched){
    return res.status(404).json({
        err:"Email or Password mismatched"
    })
}
const payload = {user:{ id: existingUser.id}};
const bearerToken = await jwt.sign(payload, 'SECRET MESSAGE',{
    expiresIn: 360000,

});

res.cookie('t', bearerToken, {expire : new Date() + 9999});

return res.status(200).json({
    bearerToken
})


    } catch (error) {
        console.log(error)
      return res.status(500).send(error)  
    }
})


router.get('/signout', (req, res)=>{
    try {
        res.clearCookie('t');
        return res.status(200).json({
            message: "cookie deleted"
        })
    } catch (error) {
        return res.status(500).send(e)
    }
})



module.exports = router;