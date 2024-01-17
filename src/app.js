const io = require('./server')
const Chat = require('./models/chat.model')

let chats = []
const updateChat = async (data) => {
    try {
        if (data) {
            await Chat.create({ user: data.username, message: data.message })
        }
        let messages = await Chat.find()
        for (let index = 0; index < messages.length; index++) {
            let user = messages[index]
            chats[index] = { username: user.user, message: user.message };
        }
    } catch (error) {
        console.log(error)
    }
}

io.on('connection', socket => {

    try {
        socket.on('newUser', async data => {
            await updateChat()
            socket.broadcast.emit('userConnected', data)
            socket.emit('messageLogs', chats)
        })

        socket.on('message', async data => {
            await updateChat(data)

            io.emit('messageLogs', chats)
        })
    } catch (error) {
        console.log(error)
    }
})



// const port = 3000

// app.listen(port, () => {
//     console.log(`Server running at port ${port}`)
// })