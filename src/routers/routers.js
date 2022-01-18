const express = require('express')
const router = express.Router()
const User = require('../model/user')
const auth = require('../midleware/auth')


////////////////////////////////////////////////////
//signup
router.post('/signup',async(req,res)=>{
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateToken()
        res.status(200).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})

/////////////////////////////////////////////////////
//login
router.post('/login',async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.status(200).send(user)
    } catch (e) {
        res.status(404).send(e.message)
    }
})
////////////////////////////////////////////////////
//profile
router.get('/profile',auth,async(req,res)=>{
    res.send(req.user)
    console.log(req.user)
})

////////////////////////////
//update

router.patch('/profile',auth,async(req,res)=>{
    const updates = Object.keys(req.body)

    try {
        updates.forEach(el =>( req.user[el] = req.body[el]))
         await req.user.save()
         res.status(200).send(req.user)
    } catch (e) {
        res.status(404).send(e)
    }
})

///////////////////////////////////////////////////
//delete
router.delete('/profile',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter(el=>{
            return el!= req.token
        })
        await req.user.save() 
        res.status(200).send('log out sucssfully')
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router