const { Router } = require('express')

const router = Router()

router.get('/chat', async (req, res) => {
    try {
        res.render('chat.handlebars')
    } catch (error) {
        res.status(500).json('Pleas try leater')
    }
})


module.exports = router