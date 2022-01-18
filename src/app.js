const express = require('express')
const app = express()
const port = process.env.PORT || 3000

require('./db/db')
app.use(express.json())
const userRouter = require('./routers/routers')
app.use(userRouter)

const newsRouter = require('./routers/newsrouter')
app.use(newsRouter)



app.listen(port,()=>{
    console.log('listing on port 3000')
})









