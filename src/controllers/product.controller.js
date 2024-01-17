const { Router } = require('express')
const ProductManager = require("../classes/product-manager.class")

console.log("Estoy en productsController")
const router = Router()
const prodcutMgr = new ProductManager("./src/products.json")

router.get('/', async (req, res) => {
    let { limit } = req.query
    console.log("Estoy en productsController en el /")
    try {
        let products = await prodcutMgr.getProducts(limit)
        res.json({ payload: products })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Server Internal Error" })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        let product = await prodcutMgr.getProductById(id)
        if (product) {
            res.json({ payload: product })
        } else {
            res.status(404).json({ Message: "Product not found" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Server Internal Error" })
    }
})

router.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body
    const newProductInfo = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    }

    try {
        await prodcutMgr.addProduct(newProductInfo)
        res.status(201).json({ Message: "The product has been created" })
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, description, price, thumbnail, code, stock } = req.body
    const updatedProductInfo = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        _id: id
    }

    try {
        await prodcutMgr.updateProduct(updatedProductInfo)
        res.status(200).json({ message: `Product updated` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: `The product have not been updated`, error: error })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        await prodcutMgr.deleteProduct(id)
        res.status(200).json({ message: `Product has been deleted` })
    } catch (error) {
        res.status(500).json({ message: `Product has not been deleted` })
    }
})

module.exports = router
