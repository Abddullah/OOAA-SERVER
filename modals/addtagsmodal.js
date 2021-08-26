const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TagsAdd = new Schema({
    count: {
        type: Number,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
})

const Tags = mongoose.model('tags', TagsAdd)
module.exports = Tags

