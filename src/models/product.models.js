const mongoose = require('mongoose')

const productCollection = 'products'

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    thumbnail: {
        type: String,
        require: false
    },
    code: {
        type: String,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    }
})

const Product = mongoose.model(productCollection, productSchema)

module.exports = Product
