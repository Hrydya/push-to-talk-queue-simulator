const mongoose= require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true
    }
});

const userModel = mongoose.model('user',userSchema);
module.exports= userModel;