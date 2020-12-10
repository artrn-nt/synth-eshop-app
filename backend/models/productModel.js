import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    image_c: { // secondary - for carousel
        type: String,
        default: undefined
    },
    description_m: { // main
        type: String,
        required: true
    },
    description_c: { // secondary - for carousel
        type: String,
        default: undefined
    },
    features: {
        type: [String],
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

export default Product