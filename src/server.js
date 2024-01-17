const express = require('express')
const router = require('./router')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const mongoConnect = require('./dao/mongoose')
require('dotenv').config()

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(process.cwd() + '/src/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', process.cwd() + '/src/views')
app.set('view engine', 'handlebars')

mongoConnect()

router(app)

//PORT
//const port = 3000;
const httpServer = app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running at port ${process.env.SERVER_PORT}`)
})

const io = new Server(httpServer)

module.exports = io;