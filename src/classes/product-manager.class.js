const Product = require('../models/product.models')
//Clase "ProductManager"
class ProductManager {

    //Constructor
    constructor(path) {
        this.path = path
        //this.products = []
    }

    //Metodo "validateProduct" recibe un objeto y devuelve true si se reciben todas las propiedades necesarias para
    //crear un objeto de la clase "Producto"
    validateProduct(product) {
        let hasTitle = product.title != null
        let hasDescription = product.description != null
        let hasPrice = product.price != null
        let hasCode = product.code != null
        let hasStock = product.stock != null

        return hasTitle && hasDescription && hasPrice && hasCode && hasStock
    }

    //Metodo "addProduct" verifica que el producto cuente con todas las propiedades necesarias, verifica que no exista 
    // un producto con el mismo "code" que del que se quiere agregar y si estas condiciones se cumplen lo agrega
    // al array products
    async addProduct(newProduct) {



        //Si tiene todas la propiedades intenta agregar el producto, sino envia un mensaje a consola
        if (this.validateProduct(newProduct)) {

            try {
                let product = await Product.findOne({ code: newProduct.code })

                //Si se encuentra un producto que tenga el mismo código no se agrega al array y se envía un mensaje al usuario
                if (product != undefined) {
                    console.log(`You can't add this product, this code ${newProduct.code} already exists`)

                    //Si el no se encuentra un elemento con el mismo código se agrega al array y se avisa por consola
                } else {

                    if (newProduct.thumbnail == undefined) {
                        newProduct.thumbnail = []
                    }

                    //newProduct.id = this.products.length + 1
                    //this.products.push(newProduct)
                    let productAdded = await Product.create(newProduct)
                    console.log(`This product has been added: `, productAdded)
                }
            } catch (error) {

            }
            //Buscar en "products" un elemento con la propiedad "code" igual a la propiedad "code"
            // del elemento que se recibe

        } else {
            //Mensaje de error en caso de que lo que se recibió como "newProduct" no cumpla con todas las propiedades
            throw new Error(`Please check the data and try again`)
        }
    }

    //Metodo que devuelve el array "products" desde el archivo en la ruta "path"
    async getProducts(limit) {
        try {
            let products
            if (limit) {
                products = await Product.find({ status: true }).limit(limit)
            } else {
                products = await Product.find({ status: true })
            }

            return products

        } catch (error) {
            console.error('The read has failed', error); //Mensaje de error en caso de falla de escritura    
        }
    }

    //Metodo que escribe en el archivo "products.json" el contenido del array "products"
    /*    async saveProducts() {
    
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(this.products))
                console.log(`The wite has been completed`); //Mensaje de confirmacion
    
            } catch (error) {
                console.error('The write has failed', err); //Mensaje de error en caso de falla de escritura
            }
        }*/

    //Metodo que busca en el array "products" un elemento que coincida con el "id" que se recibe por parametro
    async getProductById(id) {

        try {
            let product = await Product.findOne({ _id: id }) //Busca el objeto que coincida con el id recibido

            //Condicional para saber si se ha encontrado resultado o no
            if (product == undefined) {
                //Mensaje en caso de no haber encontrado coincidencia y se devuelve un "null"
                console.log(`Not found`)
                return null
            } else {
                //En caso de coincidencia se devuelve el objeto encontrado 
                return product
            }

        } catch (error) {
            console.log(error)
        }
        //await this.getProducts()  //Actualiza el array de productos desde el contenido del archivo en la ruta "path"
    }

    //Metodo que actualiza un objeto que se deberia encontrar en el archivo de la ruta path
    async updateProduct(productUpdated) {

        //Verificamos si el objeto que recibimos tiene todas las condiciones y además debe tener un id
        if (this.validateProduct(productUpdated) && productUpdated._id) {

            try {
                //Si cumple con las condiciones y tiene id, buscamos el objeto existente en el array con el mismo id
                let product = await this.getProductById(productUpdated._id)

                //Verificamos si se encontró el producto en el array
                if (!product) {
                    //Mensaje en caso que no se haya encontrado coincidencia
                    throw new Error(`Not found`)
                } else {
                    //Guardamos el nuevo contenido en el archivo de la ruta path
                    let productResult = await Product.updateOne({ _id: product._id }, productUpdated)
                    //Mensaje de confirmación de que se ha actualizado el producto
                    console.log(`The product has been updated`, productResult)
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            //Mensaje en caso que no se cumplan las condiciones o el objeto recibido no tenga id
            throw new Error('The product is not valid')
        }

    }

    async deleteProduct(id) {

        try {
            //Buscamos el objeto que coincida con el id recibido
            let product = await this.getProductById(id)
            //Buscamos el indice del objeto encontrado

            //Verificamos si se encontró el producto en el array
            if (!product) {
                //Mensaje en caso que no se haya encontrado coincidencia
                throw new Error(`Product not found`)
            } else {
                //En caso de encontrar eliminamos la posicion del array correspondiente con el id recibido
                product.status = false
                //Guardamos el nuevo contenido en el archivo de la ruta path
                await Product.updateOne({ _id: product._id }, product)
                //Mensaje de confirmación de que se ha eliminado el producto
                console.log(`The product has been deleted`, product)
            }
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = ProductManager;