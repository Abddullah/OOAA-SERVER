const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ResetPasswordSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Number,
        default: new Date().getTime(),
        // required: true
    },
})

const ResetPassword = mongoose.model('ForgetPasswordCode', ResetPasswordSchema)
module.exports = ResetPassword