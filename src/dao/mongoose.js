const mongoose = require('mongoose');
require('dotenv').config()

const mongoConnect = async () => {

    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER}@cluster0.mek1l0q.mongodb.net/ecommerce?retryWrites=true&w=majority`
        )
        console.log('db is connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = mongoConnect