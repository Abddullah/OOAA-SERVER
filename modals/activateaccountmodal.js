const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Activate = new Schema({
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

const ActivateAccount = mongoose.model('activationCode', Activate)
module.exports = ActivateAccount