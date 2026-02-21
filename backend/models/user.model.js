import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 3,
    maxlength: 30,
    trim: true
    },
    username:{
        type: String,
        required: true,
        unique: true,
        minlength: 3,
       maxlength: 20,
      trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        maxlength: 40,
    trim: true
    },
    active:{
        type: Boolean,
        default: true,
        
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    maxlength: 100
    },
    profilePicture:{
        type: String,
        
       
    },
    profilePublicId: {
        type: String,
        default: null
    },
    createdAt:{
        type: Date,
        default: Date.now

    },
    token:{
        type: String,
        default: ''

    },

});

const User = mongoose.model("User",userSchema);

export default User;