const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddAddressSchema = new Schema({
    active: {
        type: Boolean,
        required: true,
        default: false,
    },
    fullName: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    region: {
        type: String,
        required: false,
    },
    postCode: {
        type: String,
        required: false,
    },
    streetNumber: {
        type: String,
        required: false,
    },
    flatNumber: {
        type: String,
        required: false,
    },
    townCity: {
        type: String,
        required: false,
    },
    Country: {
        type: String,
        required: false,
    },
    deliveryToInstruction: {
        type: String,
        required: false,
    },
    numberToAccess: {
        type: String,
        required: false,
    },
    userId: {
        type: String,
        required: true,
    },


})




const AddAddress = mongoose.model('address', AddAddressSchema)
module.exports = AddAddress



