const jwt = require('jsonwebtoken')

const isAuthenticated = async(req, res, next)=>{
try{
const authHeader = req.headers.authorization; // breare {TOKEN}

if(!authHeader){//IF AUTHHEADER WILL FAIL
    return res.status(401).json({
        err: 'Authorization headers not found'
    })
}

const token = authHeader.split(' ')[1];

if(!token){//IF NOT HAVE ANY TOKEN
    return res.status(401).json({
        err: 'Token headers not found'
    })
}

const decoded = jwt.verify(token, "SECRET MESSAGE"); //you will get the object tiwh you have create the use t

const user = await User.findOne({where: {id:decoded.id}});
if(!user){
    return res.status(404).json({
        err: "User not found"
    })
}
req.user = user// extending the object for the next function.

/**
 * const a={};
 * a.egsggs =123;
 * a= {egsggs: 123}//this is how we extend any object
 */
next()
}catch(e){
    return res.status(500).send(e);
}
}


//FUNCTION FOR THE CHECK TO USER IS SELLER OR NOT
const isSeller = async (req, res, next)=>{
    try {
        if(req.user.dataValues.isSeller){
            next()
        }else{
            return res.status(401).json({
                err: "YOu are not seller"
            })
        }
    } catch (error) {
        
    }
}


module.exports ={isAuthenticated, isSeller}