const mongoose = require('mongoose')

// Create Cart Schema
const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Gets id of User
            required: true,
            ref: 'User', // Adds relationship between Cart and User
        },
        cartItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: String, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId, // Gets id of Product
                    required: true,
                    ref: 'Product', // Adds relationship between Cart and Product },
                },
            },
        ],
        shippingAddress: {
            address: { type: String, required: false },
            city: { type: String, required: false },
            postalCode: { type: String, required: false },
            country: { type: String, required: false },
        },
        paymentMethod: {
            type: String,
            required: false,
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        taxPrice: {
            type: Number,
            required: false,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: false,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: false,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: false,
            default: false,
        },
        paidAt: {
            type: Date,
            required: false,
        },
        isDelivered: {
            type: Boolean,
            required: false,
            default: false,
        },
        deliveredAt: {
            type: Date,
            required: false,
        },
        isDone: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = Cart = mongoose.model('Cart', cartSchema)