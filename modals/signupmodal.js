const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SignupSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    address: {
        type: String,
        required: false,
        // minlength: 8
    },
    dateofbirth: {
        type: String,
        required: true,
        // minlength: 8
    },
    verified: {
        type: Boolean,
        default: false,
        // required: true,
        // minlength: 8
    },
    createdAt: {
        type: Number,
        default: Date.now(),
        // required: true,
    },
})




const Signup = mongoose.model('user', SignupSchema)
module.exports = Signup
