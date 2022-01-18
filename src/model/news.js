const mongoose = require('mongoose')
newsSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    reporter:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    
},{ timestamps: true })


const News = mongoose.model('News',newsSchema)
module.exports = News