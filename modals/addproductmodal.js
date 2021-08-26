const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddproductSchema = new Schema({
    packing: {
        type: Boolean,
        required: true,
        default: false,
    },
    views: {
        type: Number,
        required: false,
        default: 0
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },

    rating: {
        type: Object,
        required: true,
        default: {
            times: 0,
            stars: 0
        }
    },
    categoryType: {
        type: String,
        required: true,
    },
    subcatory: {
        type: Array,
        required: false,
    },
    tags: {
        type: Array,
        required: false,
    },
    userId: {
        type: String,
        required: true,
    },
    waight: {
        type: String,
        required: false,
    },
    waightUnit: {
        type: String,
        required: false,
    },
    productImage: {
        type: Array,
        required: false
    },
    createdAt: {
        type: Number,
        default: Date.now(),
        // required: true,
    },

})




const Addproduct = mongoose.model('products', AddproductSchema)
module.exports = Addproduct
