'use strict'

import { Schema, model } from "mongoose";

const shoppingcartSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, {
    versionKey: false
})

export default model('cart', shoppingcartSchema)