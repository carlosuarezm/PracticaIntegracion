const fs = require('node:fs');
//Clase "ProductManager"
class ProductManager {

    //Constructor
    constructor(path) {
        this.path = path
        this.products = []
    }

    //Metodo "validateProduct" recibe un objeto y devuelve true si se reciben todas las propiedades necesarias para
    //crear un objeto de la clase "Producto"
    validateProduct(product) {
        let hasTitle = product.title != null
        let hasDescription = product.description != null
        let hasPrice = product.price != null
        //let hasThumbnail = product.thumbnail != null
        let hasCode = product.code != null
        let hasStock = product.stock != null

        return hasTitle && hasDescription && hasPrice && hasCode && hasStock
    }

    //Metodo "addProduct" verifica que el producto cuente con todas las propiedades necesarias, verifica que no exista 
    // un producto con el mismo "code" que del que se quiere agregar y si estas condiciones se cumplen lo agrega
    // al array products
    async addProduct(newProduct) {


        await this.getProducts() //Actualiza el array de productos desde el contenido del archivo en la ruta "path"

        //Si tiene todas la propiedades intenta agregar el producto, sino envia un mensaje a consola
        if (this.validateProduct(newProduct)) {

            //Buscar en "products" un elemento con la propiedad "code" igual a la propiedad "code"
            // del elemento que se recibe
            let product = this.products.find((p) => p.code == newProduct.code)

            //Si se encuentra un producto que tenga el mismo código no se agrega al array y se envía un mensaje al usuario
            if (product != undefined) {
                console.log(`You can't add this product, this code ${newProduct.code} already exists`)

                //Si el no se encuentra un elemento con el mismo código se agrega al array y se avisa por consola
            } else {
                if (!newProduct.hasOwnProperty('status')) {
                    newProduct.status = true
                }

                if (newProduct.thumbnail == undefined) {
                    newProduct.thumbnail = []
                }

                newProduct.id = this.products.length + 1
                this.products.push(newProduct)
                await this.saveProducts()
                console.log(`This product has been added: `, this.products[this.products.length - 1])
            }

        } else {
            //Mensaje de error en caso de que lo que se recibió como "newProduct" no cumpla con todas las propiedades
            throw new Error(`Please check the data and try again`)
        }
    }

    //Metodo que devuelve el array "products" desde el archivo en la ruta "path"
    async getProducts(limit) {
        try {
            let data = await fs.promises.readFile(this.path, 'utf-8'); // Lectura del archivo en la ruta "path"
            data === '' ? data = this.products : this.products = JSON.parse(data) // Coversion de JSON a obejto
            if (limit && limit <= this.products.length) {
                return this.products.slice(0, limit)
            } else {
                return this.products
            }
        } catch (error) {
            console.error('The read has failed', error); //Mensaje de error en caso de falla de escritura    
        }
    }

    //Metodo que escribe en el archivo "products.json" el contenido del array "products"
    async saveProducts() {

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products))
            console.log(`The wite has been completed`); //Mensaje de confirmacion

        } catch (error) {
            console.error('The write has failed', err); //Mensaje de error en caso de falla de escritura
        }
    }

    //Metodo que busca en el array "products" un elemento que coincida con el "id" que se recibe por parametro
    async getProductById(id) {
        await this.getProducts()  //Actualiza el array de productos desde el contenido del archivo en la ruta "path"
        let product = this.products.find((p) => p.id == id) //Busca el objeto que coincida con el id recibido

        //Condicional para saber si se ha encontrado resultado o no
        if (product == undefined) {
            //Mensaje en caso de no haber encontrado coincidencia y se devuelve un "null"
            console.log(`Not found`)
            return null
        } else {
            //En caso de coincidencia se devuelve el objeto encontrado 
            return product
        }
    }

    //Metodo que actualiza un objeto que se deberia encontrar en el archivo de la ruta path
    async updateProduct(productUpdated) {

        //Verificamos si el objeto que recibimos tiene todas las condiciones y además debe tener un id
        if (this.validateProduct(productUpdated) && productUpdated.id) {
            //Si cumple con las condiciones y tiene id, buscamos el objeto existente en el array con el mismo id
            let product = await this.getProductById(productUpdated.id)
            //Buscamos el indice del objeto encontrado
            let productIndex = this.products.indexOf(product)
            //Verificamos si se encontró el producto en el array
            if (productIndex < 0) {
                //Mensaje en caso que no se haya encontrado coincidencia
                throw new Error(`Not found`)
            } else {
                //En caso de encontrar actualizamos la posicion del array correspondiente con el objeto recibido
                this.products[productIndex] = productUpdated
                //Guardamos el nuevo contenido en el archivo de la ruta path
                await this.saveProducts()
                //Mensaje de confirmación de que se ha actualizado el producto
                console.log(`The product has been updated`, productUpdated)
            }
        } else {
            //Mensaje en caso que no se cumplan las condiciones o el objeto recibido no tenga id
            throw new Error('The product is not valid')
        }

    }

    async deleteProduct(id) {
        //Buscamos el objeto que coincida con el id recibido
        let product = await this.getProductById(id)
        //Buscamos el indice del objeto encontrado
        let productIndex = this.products.indexOf(product)
        //Verificamos si se encontró el producto en el array
        if (productIndex < 0) {
            //Mensaje en caso que no se haya encontrado coincidencia
            throw new Error(`Product not found`)
        } else {
            //En caso de encontrar eliminamos la posicion del array correspondiente con el id recibido
            product = this.products.splice(productIndex)
            //Guardamos el nuevo contenido en el archivo de la ruta path
            await this.saveProducts()
            //Mensaje de confirmación de que se ha eliminado el producto
            console.log(`The product has been deleted`, product)
        }
    }

}

module.exports = ProductManager;