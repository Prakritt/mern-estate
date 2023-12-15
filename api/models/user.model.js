import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username : {
        type : String, //Type String means that any type other than string will be invalid.
        required : true,
        unique: true
    },
    email : {
        type : String, 
        required : true,
        unique: true
    },
    password : {
        type : String, 
        required : true
    }
},{timestamps:true})

const User = mongoose.model('User',userSchema);

export default User;

