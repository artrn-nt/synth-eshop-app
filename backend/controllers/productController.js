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

export {
    getProducts,
    getProductById,
    deleteProduct
}