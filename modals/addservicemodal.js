const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddServiceSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    shopeName: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: false,
    },
    catogery: {
        type: String,
        required: true,
    },
    shopeTime: {
        type: Object,
        required: true,
        default: {
            opening: "08:00:00",
            closing: "20:00:00"
        }
    },
    latitude: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
        required: true,
    },
    serviceImage: {
        type: Array,
        required: false
    },
    rating: {
        type: Object,
        required: true,
        default: {
            times: 0,
            stars: 0
        }
    },
    views: {
        type: Number,
        required: false,
        default: 0
    },
    userId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Number,
        default: Date.now(),
    },
})

module.exports = mongoose.model('service(establishment)', AddServiceSchema)
