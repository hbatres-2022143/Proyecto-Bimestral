'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import userRouter from '../src/user/user.routes.js'
import categoryRouter from '../src/category/category.routes.js'
import productRouter from '../src/product/product.routes.js'
import invoiceRouter from '../src/invoice/invoice.routes.js'
import shoppingRouter from '../src/shopping/shopping.routes.js'

const app = express()
config()
const port = process.env.PORT || 3200

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use('/user', userRouter)
app.use('/category', categoryRouter)
app.use('/product', productRouter)
app.use('/invoice', invoiceRouter)
app.use('/shopping', shoppingRouter)

export const initServer = () => {
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}
