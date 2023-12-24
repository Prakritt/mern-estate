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
    },
    avatar:{
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1200px-User-avatar.svg.png'
    }

},{timestamps:true})

const User = mongoose.model('User',userSchema);

export default User;

