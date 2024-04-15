const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require("validator")



const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true, 
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    phone: {
        type: String, 
        validate: [validator.isMobilePhone, "Please Enter a valid Phone Number"]
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [6, "Password is too short"],
        maxLength: [12, "Password is too big"],
    }, 
})

// converting password into hash
userSchema.pre("save", async function () {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// compairing password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

//josn web token genrator
userSchema.methods.getJWTtoken =  function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECREATE, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

module.exports = mongoose.model('user', userSchema)

