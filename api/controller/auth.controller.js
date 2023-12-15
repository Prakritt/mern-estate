import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {errorHandler} from '../utils/error.js'

export const signUp = async (req,res,next)=>{

    const {username, email, password} = req.body;
    const hash = bcryptjs.hashSync(password,10)
    const newUser = new User({username,email,password:hash})
    try{

        await newUser.save();
        res.status(201).json({
            message : "User Created Successfully."
        })

    }catch(error){
        next(error)
    }

}

export const signIn = async (req,res,next)=>{

    const {email,password} = req.body;
    try{

        const validUser = await User.findOne({email})
    
        if(!validUser){
            return next(errorHandler(404,'Invalid Credentials'))
        }
    
        const validPassword = bcryptjs.compareSync(password,validUser.password);
    
        if(!validPassword){
            return next(errorHandler(401,'Invalid Credentials'));
        }
    
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        const {password:hashPassword,...rest} = validUser._doc

        res.cookie('access-token',token,{httpOnly:true}).status(200).json(rest);
         
    }catch(error){
        next(error);
    }



}