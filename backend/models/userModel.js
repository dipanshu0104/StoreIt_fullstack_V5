const mongoose = require("mongoose")
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

email:{
 type:String,
 require:true,
 unique: true
},
name :{
type:String,
require: true
},
password:{
    type:String,
    required: true
},
lastLogin:{
    type: Date,
    default: Date.now
},
isVerified: {
    type: Boolean,
    default: false
},
dp: {
    type: String, // Example: '/uploads/user123.jpg'
    default: '/upload/680f414905d785217ab96f64/hi.jpg'   // Optional default path or empty string
  },
resetPasswordToken: String,
resetPasswordExpiresAt: Date,
verificationToken: String,
verificationTokenExpiresAt: Date,

}, {timestamps: true})



module.exports = mongoose.model('user', userSchema);
