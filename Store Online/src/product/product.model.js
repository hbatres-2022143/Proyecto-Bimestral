'use strict'

import { Schema, model } from 'mongoose'

const productSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    },
    average: {
        type: String,
        enum: ['HIGH', 'MEDIUM', 'LOW', 'NONE'],
        default: 'NONE',
        required: true
    },
    sales: {
        type: Number,
        default: 0
    }
},
    {
        versionKey: false,
    }
)

export default model('product', productSchema)
