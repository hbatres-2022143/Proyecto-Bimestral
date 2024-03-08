'use strict'

import express from 'express'
import { addProduct, addProductToCart, deleteProduct, updateProduct, viewProduct, viewProductByName, viewProducts, viewProductsBestSelling, viewProductsByCategory, viewProductsSoldOut } from './product.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/addProduct', [validateJwt, isAdmin], addProduct)
api.put('/updateProduct/:id', [validateJwt, isAdmin], updateProduct)
api.delete('/deleteProduct/:id', [validateJwt, isAdmin], deleteProduct)
api.get('/viewProductsSoldOut', [validateJwt, isAdmin], viewProductsSoldOut)
api.get('/viewProduct/:id', [validateJwt, isAdmin], viewProduct)

api.get('/viewProductts', [validateJwt], viewProducts)
api.post('/viewProductsByCategory', [validateJwt], viewProductsByCategory)
api.post('/viewProductByName', [validateJwt], viewProductByName)
api.get('/viewProductsBestSelling', [validateJwt], viewProductsBestSelling)
api.put('/addProductToCart', [validateJwt], addProductToCart)

export default api