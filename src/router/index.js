const productsController = require("../controllers/product.controller")
const cartsController = require("../controllers/cart.controller")
const templateController = require('../controllers/template.controller')
const router = app => {
    //console.log('Rotuer user')
    console.log("Estoy en el router")
    app.use('/', templateController)
    app.use('/api/products', productsController)
    app.use('/api/carts', cartsController)
}

module.exports = router