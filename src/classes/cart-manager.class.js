const Cart = require('../models/cart.model')
//Clase "ProductManager"
class CartManager {

    //Constructor
    constructor(path, productManager) {
        this.path = path
        //this.carts = []
        this.productManager = productManager
    }

    validateProducts(products) {
        let count = 0
        let isValid = true
        while (count < products.length && isValid) {
            let currentProduct = products[count]
            isValid = currentProduct.hasOwnProperty('id') && currentProduct.hasOwnProperty('quantity')
            count++
        }

        return isValid
    }

    //Metodo "addProduct" verifica que el producto cuente con todas las propiedades necesarias, verifica que no exista 
    // un producto con el mismo "code" que del que se quiere agregar y si estas condiciones se cumplen lo agrega
    // al array products
    async createCart(newCart) {


        //await this.getCarts() //Actualiza el array de productos desde el contenido del archivo en la ruta "path"
        if (newCart.products == undefined) {
            newCart.products = []
        }
        //Si tiene todas la propiedades intenta agregar el producto, sino envia un mensaje a consola
        if (this.validateProducts(newCart.products)) {
            //newCart.id = this.carts.length + 1
            //this.carts.push(newCart)
            try {
                const createdCart = await Cart.create(newCart)
                console.log(`This Cart has been added: `, createdCart)
                return createdCart
            } catch (error) {
                console.log(error)
                throw error
            }

        } else {
            //Mensaje de error en caso de que lo que se recibió como "newProduct" no cumpla con todas las propiedades
            throw new Error(`Please check the data and try again`)
        }
    }

    //Metodo que devuelve el array "products" desde el archivo en la ruta "path"
    async getCarts() {
        try {
            let cart = await Cart.find({}, { __v: 0 })
            return cart
        } catch (error) {
            console.log('The read has failed', error); //Mensaje de error en caso de falla de escritura    
        }
    }

    //Metodo que escribe en el archivo "products.json" el contenido del array "products"
    async updateCart(cart) {

        try {
            await Cart.updateOne({ _id: cart._id }, cart)
            console.log(`The update has been completed`); //Mensaje de confirmacion

        } catch (error) {
            console.log('The update has failed', err); //Mensaje de error en caso de falla de escritura
        }
    }

    //Metodo que busca en el array "products" un elemento que coincida con el "id" que se recibe por parametro
    async getCartById(id) {
        //await this.getCarts()  //Actualiza el array de productos desde el contenido del archivo en la ruta "path"
        try {
            let cart = await Cart.findOne({ _id: id }, { __v: 0 })

            //Condicional para saber si se ha encontrado resultado o no
            if (cart == undefined) {
                //Mensaje en caso de no haber encontrado coincidencia y se devuelve un "null"
                console.log(`Not found`)
                return null
            } else {
                //En caso de coincidencia se devuelve el objeto encontrado 
                return cart
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getProductsByCart(cartId) {
        try {
            let cart = await this.getCartById(cartId)
            const cartProducts = [];
            if (cart) {
                for (let product of cart.products) {
                    const { title, description, price, thumbnail, code } = await this.productManager.getProductById(product.id)
                    let productInfo = {
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        quantity: product.quantity
                    }
                    cartProducts.push(productInfo)
                }
                return cartProducts

                //return products
            } else {
                throw new Error(`Cart not found`)
            }
        } catch (error) {
            console.log(error)
            throw error
        }

    }

    //Metodo que actualiza un objeto que se deberia encontrar en el archivo de la ruta path
    async addProductToCart(cartId, productToAdd) {

        try {
            let cart = await this.getCartById(cartId)
            //Verificamos si el objeto que recibimos tiene todas las condiciones y además debe tener un id
            if (cart && productToAdd.hasOwnProperty('id') && productToAdd.hasOwnProperty('quantity')) {
                //Si cumple con las condiciones y tiene id, buscamos el objeto existente en el array con el mismo id

                let product = await this.productManager.getProductById(productToAdd.id)
                //Buscamos el indice del objeto encontrado
                if (product && product.stock >= productToAdd.quantity) {
                    product.stock = product.stock - productToAdd.quantity
                    await this.productManager.updateProduct(product)
                    let productAddedIndex = cart.products.findIndex((p) => p.id == product.id)
                    if (productAddedIndex >= 0) {
                        cart.products[productAddedIndex].quantity = cart.products[productAddedIndex].quantity + productToAdd.quantity
                    } else {
                        cart.products.push({ id: productToAdd.id, quantity: productToAdd.quantity })
                    }
                    await this.updateCart(cart)
                } else {
                    throw new Error('The quantity required is not available')
                }

            } else {
                //Mensaje en caso que no se cumplan las condiciones o el objeto recibido no tenga id
                throw new Error('The product is not valid')
            }

        } catch (error) {
            console.log(error)
        }

    }

}

module.exports = CartManager;