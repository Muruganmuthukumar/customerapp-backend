const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email:{
        type:String,  
        required:true,
        unique:true,
    },
    mobile: {
        type: String,
        required: true,
        unique:true,
    },
    membership: {
        type: Boolean,
        required: true,
    },
    photoURL: {
        type: String,
    }
    
},{ timestamps:true });

const User = mongoose.model("user", userScheme);

module.exports=User;