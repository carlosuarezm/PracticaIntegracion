const mongoose = require('mongoose')

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: []
    }
})

const Cart = mongoose.model(cartCollection, cartSchema)

module.exports = Cart