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
    brand: {
        type: String,
        required: true
    },
    categories: {
        type: Object,
        required: ['synthesis', 'voiceType', 'semiModular', 'desktop'],
        properties: {
            synthesis: {
                type: String,
                default: 'Analogue'
            },
            voiceType: {
                type: String,
                default: 'Monophonic'
            },
            semiModular: {
                type: Boolean,
                default: false
            },
            desktop: {
                type: Boolean,
                default: false
            }
        }
    },
    // categories: {
    //     type: [String],
    //     required: true
    // },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
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
    image: { // main
        type: String,
        required: true
    },
    image_c: { // secondary - for carousel
        type: String,
        default: undefined
    },
    isPublished: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

export default Product