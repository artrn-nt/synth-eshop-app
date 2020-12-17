import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @descr   Fetch all products
// @route   GET /api/products 
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)
})

// @descr   Fetch single product
// @route   GET /api/products/:id 
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @descr   Delete a product
// @route   DELETE /api/products/:id 
// @access  Private / Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await product.remove()
        res.json({ message: 'Product removed' })

    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @descr   Create a product
// @route   POST /api/products
// @access  Private / Admin
const createProduct = asyncHandler(async (req, res) => {
    const {
        user,
        name,
        brand,
        categories,
        price,
        countInStock,
        description_m,
        features,
        image,
        isPublished
    } = req.body

    const product = new Product({
        user,
        name,
        brand,
        categories,
        price,
        countInStock,
        description_m,
        features,
        image,
        isPublished
    })

    const createdProduct = await product.save()

    if (createdProduct) {
        res.status(201).json(createdProduct)
    } else {
        res.status(400)
        throw new Error('Invalid product data')
    }

})

// @descr   Update a product
// @route   PUT /api/products/:id
// @access  Private / Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        user,
        image,
        category,
        brand,
        countInStock,
        description_m,
        features
    } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.price = price
        product.user = user
        product.image = image
        product.category = category
        product.brand = brand
        product.countInStock = countInStock
        product.description_m = description_m
        product.features = features

        const updatedProduct = await product.save()
        res.json(updatedProduct)

    } else {
        res.status(404)
        throw new Error('Product not found')
    }

})

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct
}