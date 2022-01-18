const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value<0){
                throw new Error('cannot enter negtive age')
            }
        }
    },
    phone:{
        type:Number,
        required:true,
        maxlength:11,
        minlength:11,
        validate(value){
            if(!validator.isMobilePhone(value.toString(),'ar-EG')){
                throw new Error('invaled phone number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invaled Email')
            }
        }
    },
    tokens:[{
        type:String,
        required:true
    }]
},{timestamps:true})

userSchema.pre('save',async function(){
    const user = this
    
    if(user.isModified('password')){
        {user.password = await bcrypt.hash(user.password,8)}
    }
})
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable To Login')
    }
    const isMatch = bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable To Login')
    }
    return user
}

userSchema.methods.generateToken = async function(){
    const user = this
    const token =  jwt.sign({_id:user._id.toString()},'news')
    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
}

userSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'reporter'
})


const User = mongoose.model('User',userSchema)

module.exports = User