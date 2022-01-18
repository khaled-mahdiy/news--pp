const User = require('../model/user')
const jwt = require('jsonwebtoken')
const auth = async (req,res,next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ','')
    const decode = jwt.verify(token,'news')
    const user = await User.findOne({_id:decode._id,tokens:token})

    req.user = user
    req.token = token

    if(!user){
        throw new Error
    }
    } catch (e) {
     res.status(401).send({Error:'UnAuthorization'})   
    }
    next()
}

module.exports = auth