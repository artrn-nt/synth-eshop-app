import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @descr   Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingInfo,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    } = req.body

    if (orderItems && orderItems.length === 0) {
        res.status(404)
        throw new Error('No order items')
        return
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingInfo,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        })

        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
})

// @descr   Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @descr   Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        // Added from Paypal
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updatedOrder = await order.save()

        res.json(updatedOrder)

    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @descr   Update order to shipped (out to delivery)
// @route   PUT /api/orders/:id/deliver
// @access  Private / Admin
const updateOrderToShipped = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isShipped = true
        order.shippedAt = Date.now()

        const updatedOrder = await order.save()

        res.json(updatedOrder)

    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @descr   Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    // More than one => .find()
    const orders = await Order.find({ user: req.user._id })

    if (orders) {
        res.json(orders)
    } else {
        res.status(404)
        throw new Error('Orders not found')
    }
})

// @descr   Get all orders
// @route   GET /api/orders
// @access  Private / Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)
})

export {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToShipped,
    getMyOrders,
    getOrders
}

