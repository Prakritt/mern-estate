import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'

import userRouter from './routes/user.routes.js'

dotenv.config()
const app = express();

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connection to DB was successful")
}).catch(err=>{
    console.log(err)
})

app.listen(3000, ()=>{
    console.log("Server is running on PORT 3000!!!");
})

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.use('/user',userRouter)