const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName:String, 
    lastName:String, 
    email:String, 
    password:String,
})

const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;