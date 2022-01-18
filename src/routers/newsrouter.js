const express = require('express')
const router = express.Router()
const News = require('../model/news')
const auth = require('../midleware/auth')

router.post('/news',auth,async(req,res)=>{
    try{
        const news = new News({...req.body,reporter:req.user._id})
        // console.log(news.createdAt)
        // news.updatedAt
        // news.createdAt instanceof Date
        await news.save()
        // console.log(news.createdAt)
        res.send(news)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/news',auth,async(req,res)=>{
    try {
       await req.user.populate('news')
       res.send(req.user.news)
    } catch (e) {
        res.status(404).send(e.message)
    }
})





router.get('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try {
        const news = await News.findOne({_id,reporter:req.user._id})
        if(!news){
            return res.send('Unable To Find Task')
        }
        res.send(news)
    } catch(e){
        res.status(500).send(e)
    }
})


router.patch('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findOneAndUpdate({_id,reporter:req.user._id},req.body,{
            new:true,
            runvalidators:true
        })
        if(!news){
            return  res.status(404).send('Unable To Find user')
          }
        res.status(200).send(news)
    }catch(e){
        res.status(400).send(e.message)
    }
})
router.delete('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findOneAndDelete({_id,reporter:req.user._id})
        if(!news){
            return res.status(400).send('Task Not Found')
        }
        res.send(news)
    }catch(e){
        res.status(404).send('ERRor Task Not Found')
    }
})

module.exports = router